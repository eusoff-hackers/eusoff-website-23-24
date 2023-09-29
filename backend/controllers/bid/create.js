const UTILS = `../../utils`;
const MODELS = `../../models`;

const { resBuilder } = require(`${UTILS}/req_handler`);
const { success, sendStatus } = require(`${UTILS}/req_handler`);
const { logger, logAndThrow } = require(`${UTILS}/logger`);
const { Jersey } = require(`${MODELS}/jersey`);
const { User } = require(`${MODELS}/user`);
const { Bid } = require('../../models/bid');

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
  try {
    const { user: userSession } = req.session;
    if (!userSession) {
      return await sendStatus(res, 401);
    }
    const { username } = userSession;

    const user = await User.findOne({ username });
    if (user.isEligible === false) {
      return await sendStatus(res, 400, `Not eligible for a bid.`);
    }

    const { bids } = req.body;

    const jobs = await Promise.allSettled(
      bids.map(async (bid) => Jersey.findOne({ number: bid.number })),
    );

    const jerseys = logAndThrow(jobs);
    if (jerseys.some((r) => r === null)) {
      return await sendStatus(res, 400, `Invalid jersey number(s).`);
    }

    const newBids = jerseys.map((jersey, index) => ({
        user: user._id,
        jersey: jersey._id,
        priority: index,
      }));

    await Bid.deleteMany({ user: user._id });
    const bidIds = (await Bid.create(newBids)).map((bid) => bid._id);

    user.bids = bidIds;
    await user.save();

    return await success(res);
  } catch (error) {
    logger.error(`Login error: ${error.message}`, { error });
    return sendStatus(res, 500);
  }
}

module.exports = {
  method: `POST`,
  url: `/create`,
  schema,
  handler,
};
