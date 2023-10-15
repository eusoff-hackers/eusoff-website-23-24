const UTILS = `../../utils`;
const MODELS = `../../models`;

const { resBuilder } = require(`${UTILS}/req_handler`);
const { success, sendStatus } = require(`${UTILS}/req_handler`);
const auth = require(`${UTILS}/auth.js`);
const { logger } = require(`${UTILS}/logger`);
const { User } = require(`${MODELS}/user`);
const bcrypt = require(`bcryptjs`);

const schema = {
  body: {
    type: `object`,
    required: [`credentials`],
    properties: {
      credentials: {
        type: `object`,
        additionalProperties: false,
        required: [`username`, `password`],
        properties: {
          username: { type: `string` },
          password: { type: `string` },
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
    const {
      credentials: { username, password },
    } = req.body;

    if (!(await User.exists({ username }))) {
      return await sendStatus(res, 401, `Invalid credentials`);
    }
    const user = await User.findOne({ username }).format();

    if (!user || (await bcrypt.compare(password, user.password)) === false) {
      return sendStatus(res, 401, `Invalid credentials.`);
    }

    await auth.login(user, req);
    return await success(res, { user });
  } catch (error) {
    logger.error(`Login error: ${error.message}`, { error });
    return sendStatus(res, 500);
  }
}

module.exports = {
  method: `POST`,
  url: `/login`,
  schema,
  handler,
};
