const UTILS = `../../utils`;

const { resBuilder } = require(`${UTILS}/req_handler`);
const { success, sendStatus } = require(`${UTILS}/req_handler`);
const { logger } = require(`${UTILS}/logger`);
const { getEligible } = require(`${UTILS}/eligibilityChecker`);

const schema = {
  response: {
    200: resBuilder({
      jerseys: {
        type: `array`,
        uniqueItems: true,
        items: {
          $ref: `jersey`,
        },
      },
    }),
  },
};

async function handler(req, res) {
  try {
    const { user } = req.session;
    if (!user) {
      return await sendStatus(res, 401);
    }

    const jerseys = await getEligible(user);
    return await success(res, { jerseys });
  } catch (error) {
    logger.error(`Login error: ${error.message}`, { error });
    return sendStatus(res, 500);
  }
}

module.exports = {
  method: `GET`,
  url: `/eligible`,
  schema,
  handler,
};
