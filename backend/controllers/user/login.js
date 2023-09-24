const UTILS = `../../utils`;

const { resBuilder } = require(`${UTILS}/req_handler`);
const { success, sendStatus } = require(`${UTILS}/req_handler`);
const auth = require(`${UTILS}/auth.js`);
const { logger } = require(`${UTILS}/logger`);

const schema = {
  body: {
    type: `object`,
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
        username: { type: `string` },
      },
    }),
  },
};

async function handler(req, res) {
  try {
    await auth.login(req.body.credentials, req);
    return await success(res, { username: req.body.credentials.username });
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
