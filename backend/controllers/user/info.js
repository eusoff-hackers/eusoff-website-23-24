const UTILS = `../../utils`;
const MODELS = `../../models`;

const { resBuilder } = require(`${UTILS}/req_handler`);
const { success, sendStatus } = require(`${UTILS}/req_handler`);
const { logger } = require(`${UTILS}/logger`);
const { User } = require(`${MODELS}/user`);
const { auth } = require(`${UTILS}/auth`);

const schema = {
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
    const formatted = await User.findById(user._id).format();

    return await success(res, { user: formatted });
  } catch (error) {
    logger.error(`User info error: ${error.message}`, { error });
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
