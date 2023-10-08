const UTILS = `../../utils`;
const MODELS = `../../models`;

const { resBuilder } = require(`${UTILS}/req_handler`);
const { success, sendStatus } = require(`${UTILS}/req_handler`);
const { logger, logAndThrow } = require(`${UTILS}/logger`);
const { Bid } = require(`${MODELS}/bid`);
const { Jersey } = require(`${MODELS}/jersey`);
const { User } = require(`${MODELS}/user`);

const schema = {
  response: {
    200: resBuilder({
      type: 'object',
      patternProperties: {
        '^[0-9]{1,2}$': {
          type: `object`,
          properties: {
            Male: {
              type: `array`,
              items: {
                $ref: 'user',
              },
              additionalProperties: false,
            },
            Female: {
              type: `array`,
              items: {
                $ref: 'user',
              },
            },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    }),
  },
};

async function getJerseyInfo(jersey) {
  const bidders = await Bid.find({ jersey: jersey._id });
  const biddersInfo = logAndThrow(
    await Promise.allSettled(bidders.map((bid) => User.findById(bid.user))),
  );

  const Male = biddersInfo
    .filter((bidder) => bidder.gender === `Male`)
    .map(({ username, points }) => ({
      username,
      points,
    }))
    .sort((a, b) => b.points - a.points);

  const Female = biddersInfo
    .filter((bidder) => bidder.gender === `Female`)
    .map(({ username, points }) => ({
      username,
      points,
    }))
    .sort((a, b) => b.points - a.points);

  return { Male, Female };
}

async function handler(req, res) {
  try {
    const jerseys = await Jersey.find(); // Fetch all jerseys
    const data = logAndThrow(
      await Promise.allSettled(jerseys.map(getJerseyInfo)),
    );
    return await success(res, data);
  } catch (error) {
    logger.error(`Jersey info error: ${error.message}`, { error });
    return sendStatus(res, 500);
  }
}

module.exports = {
  method: `GET`,
  url: `/info`,
  schema,
  handler,
};
