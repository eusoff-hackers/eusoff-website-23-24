const UTILS = `../../utils`;
const MODELS = `../../models`;

const { resBuilder } = require(`${UTILS}/req_handler`);
const { success, sendStatus } = require(`${UTILS}/req_handler`);
const { logger, logAndThrow } = require(`${UTILS}/logger`);
const { Jersey } = require(`${MODELS}/jersey`);
const { Bid } = require('../../models/bid');
const { User } = require('../../models/user');

const mongoose = require(`mongoose`);

const { auth } = require(`${UTILS}/auth`);

const { isEligible } = require(`${UTILS}/eligibilityChecker`);

const schema = {
  body: {
    type: `object`,
    required: [`bids`],
    properties: {
      bids: {
        type: `array`,
        maxItems: 5,
        uniqueItems: true,
        items: {
          $ref: `jersey`,
        },
      },
    },
  },
  response: {
    200: resBuilder({
      type: `object`,
      properties: {
        user: {
          $ref: `user`,
        },
      },
    }),
  },
};

async function handler(req, res) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction({ readConcern: { level: `snapshot` } });

    const { user: unsafeUser } = req.session;
    const { bids } = req.body;

    const user = await User.findById(unsafeUser._id)
      .populate(`teams`)
      .populate(`bids`)
      .session(session);

    const jerseyParsingJobs = await Promise.allSettled(
      bids.map(async (bid) =>
        Jersey.findOne({ number: bid.number }).session(session),
      ),
    );

    const jerseys = logAndThrow(jerseyParsingJobs);
    if (jerseys.some((r) => r === null)) {
      return await sendStatus(res, 400, `Invalid jersey number(s).`);
    }

    if ((await isEligible(user, jerseys)) === false) {
      return await sendStatus(res, 400, `Not eligible for a bid.`);
    }

    const newBids = jerseys.map((jersey, index) => ({
      user: user._id,
      jersey: jersey._id,
      priority: index,
    }));

    await Bid.deleteMany({ _id: { $in: user.bids } }).session(session);
    const bidIds = (await Bid.create(newBids, { session })).map(
      (bid) => bid._id,
    );

    await User.findOneAndUpdate({ _id: user._id }, { bids: bidIds }).session(
      session,
    );

    await session.commitTransaction();
    return await success(res);
  } catch (error) {
    logger.error(`Bid creation error: ${error.message}`, { error });
    await session.abortTransaction();
    return sendStatus(res, 429);
  } finally {
    session.endSession();
  }
}

module.exports = {
  method: `POST`,
  url: `/create`,
  schema,
  preHandler: auth,
  handler,
};
