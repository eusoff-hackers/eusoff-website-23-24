const UTILS = `../../utils`;
const MODELS = `../../models`;

const { resBuilder } = require(`${UTILS}/req_handler`);
const { success, sendStatus } = require(`${UTILS}/req_handler`);
const { logger, logAndThrow } = require(`${UTILS}/logger`);
const { Jersey } = require(`${MODELS}/jersey`);
const { Bid } = require('../../models/bid');

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
  try {
    const { user } = req.session;
    const { bids } = req.body;

    const jerseyParsingJobs = await Promise.allSettled(
      bids.map(async (bid) => Jersey.findOne({ number: bid.number })),
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
  preHandler: auth,
  handler,
};
