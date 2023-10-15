const UTILS = `../../utils`;

const { success, sendStatus } = require(`${UTILS}/req_handler`);
const auth = require(`${UTILS}/auth.js`);
const { logger } = require(`${UTILS}/logger`);

async function handler(req, res) {
  try {
    await auth.logout(req);
    return await success(res);
  } catch (error) {
    logger.error(`Logout error: ${error.message}`, { error });
    return sendStatus(res, 500);
  }
}

module.exports = {
  method: `POST`,
  url: `/logout`,
  handler,
};
