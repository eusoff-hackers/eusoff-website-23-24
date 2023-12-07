const UTILS = `../../utils`;
const MODELS = `../../models`;

const { resBuilder } = require(`${UTILS}/req_handler`);
const { success, sendStatus } = require(`${UTILS}/req_handler`);
const { logger, logAndThrow } = require(`${UTILS}/logger`);
const { Bid } = require(`${MODELS}/bid`);
const { Jersey } = require(`${MODELS}/jersey`);
const { User } = require(`${MODELS}/user`);
const { checkCache, setCache } = require(`${UTILS}/cache_handler`);
const mongoose = require(`mongoose`);

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
            quota: {
              type: `object`,
              properties: {
                Male: { type: `number` },
                Female: { type: `number` },
              },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    }),
  },
};

async function getJerseyInfo(jersey, session) {
  const bidders = await Bid.find({ jersey: jersey._id }).session(session);
  const biddersInfo = logAndThrow(
    await Promise.allSettled(
      bidders.map((bid) =>
        User.findById(bid.user).session(session).format(session),
      ),
    ),
    `User find error`,
  );

  const Male = biddersInfo
    .filter((bidder) => bidder.gender === `Male`)
    .map(({ username, points, teams }) => ({
      username,
      points,
      teams,
    }))
    .sort((a, b) => b.points - a.points);

  const Female = biddersInfo
    .filter((bidder) => bidder.gender === `Female`)
    .map(({ username, points, teams }) => ({
      username,
      points,
      teams,
    }))
    .sort((a, b) => b.points - a.points);

  const { quota } = jersey;

  return { Male, Female, quota };
}

async function handler(req, res) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction({ readConcern: { level: `majority` } });
    const jerseys = await Jersey.find().session(session); // Fetch all jerseys
    const jerseyData = logAndThrow(
      await Promise.allSettled(
        jerseys.map(async (jersey) => {
          const info = await getJerseyInfo(jersey, session);
          return { number: jersey.number, info };
        }),
      ),
      `Jersey info parsing error.`,
    );

    const data = jerseyData.reduce(
      (a, v) => ({ ...a, [v.number]: v.info }),
      {},
    );
    return await success(res, data);
  } catch (error) {
    logger.error(`Jersey info error: ${error.message}`, { error });
    return sendStatus(res, 500);
  } finally {
    session.endSession();
  }
}

module.exports = {
  method: `GET`,
  url: `/info`,
  schema,
  preHandler: checkCache,
  handler,
  onSend: setCache,
};
