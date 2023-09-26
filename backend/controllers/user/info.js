const UTILS = `../../utils`;
const MODELS = `../../models`;

const { resBuilder } = require(`${UTILS}/req_handler`);
const { success, sendStatus } = require(`${UTILS}/req_handler`);
const { logger } = require(`${UTILS}/logger`);
const { User } = require(`${MODELS}/user`);

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
    if (!user) {
      return await sendStatus(res, 401);
    }

    const { username } = user;
    const newUser = await User.findOne({ username }).format();
    return await success(res, { user: newUser });
  } catch (error) {
    logger.error(`Login error: ${error.message}`, { error });
    return sendStatus(res, 500);
  }
}

module.exports = {
  method: `GET`,
  url: `/info`,
  schema,
  handler,
};
