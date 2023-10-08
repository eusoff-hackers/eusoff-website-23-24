const UTILS = `../../utils`;
const MODELS = `../../models`;

const { resBuilder } = require(`${UTILS}/req_handler`);
const { success, sendStatus } = require(`${UTILS}/req_handler`);
const { logger } = require(`${UTILS}/logger`);
const { auth } = require(`${UTILS}/auth`);
const { Bid } = require(`${MODELS}/bid`);
const { Jersey } = require(`${MODELS}/jersey`);
const { User } = require(`${MODELS}/user`);

const schema = {
  response: {
    200: resBuilder({
      jerseyInfo: {
        type: 'object',
        additionalProperties: {
          type: 'array',
          items: {
            $ref: 'user',
          },
        },
      },
    }),
  },
};

async function handler(req, res) {
  try {
    const jerseys = await Jersey.find(); // Fetch all jerseys
    const jerseyUserPromises = jerseys.map(async (jersey) => {
      const jerseyNumber = jersey.number;
      const bidsForJersey = await Bid.find({ jersey: jersey._id });
      const userPromises = bidsForJersey.map((bid) => User.findById(bid.user));
      const biddedUsers = await Promise.all(userPromises);
      return { jersey: jerseyNumber, users: biddedUsers };
    });

    const results = await Promise.all(jerseyUserPromises);

    const allJerseyInfo = {};
    results.forEach(({ jersey, users }) => {
      allJerseyInfo[jersey] = users;
      // jersey is an object, users is an array of user objects
    });

    return await success(res, { allJerseyInfo });
  } catch (error) {
    logger.error(`Login error: ${error.message}`, { error });
    return sendStatus(res, 500);
  }
}

module.exports = {
  method: `GET`,
  url: `/info`,
  schema,
  preHandler: auth,
  handler,
};
