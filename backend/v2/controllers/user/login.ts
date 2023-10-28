import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { FromSchema } from 'json-schema-to-ts';

const UTILS_PATH = `../../utils`;
const MODELS_PATH = `../../models`;

const { resBuilder, success, sendStatus } = require(
  `${UTILS_PATH}/req_handler`,
);
const { MongoSession } = require(`${UTILS_PATH}/mongoSession`);
const { User } = require(`${MODELS_PATH}/user`);
const { reportError } = require(`${UTILS_PATH}/logger`);
const bcrypt = require(`bcryptjs`);
const auth = require(`${UTILS_PATH}/auth`);

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
} as const;

type iBody = FromSchema<typeof schema.body>;

async function handler(
  req: FastifyRequest<{ Body: iBody }>,
  res: FastifyReply,
) {
  try {
    const session = new MongoSession();
    await session.start();
    try {
      const {
        credentials: { username, password },
      } = req.body satisfies iBody;

      if (!(await User.exists({ username }).session(session.session))) {
        return await sendStatus(res, 401, `Invalid credentials.`);
      }
      const user = await User.findOne({ username }).session(session.session);

      if (!(await bcrypt.compare(password, user.password))) {
        return sendStatus(res, 401, `Invalid credentials.`);
      }

      await auth.login(user, req);
      return await success(res, { user });
    } catch (error) {
      reportError(error, `Error login handler`);
      return sendStatus(res, 500, `Internal Server Error.`);
    } finally {
      await session.end();
    }
  } catch (error) {
    reportError(error, `Mongo Session error`);
    return sendStatus(res, 500, `Internal Server Error.`);
  }
}

const login: RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  { Body: iBody }
> = {
  method: `POST`,
  url: `/login`,
  schema,
  handler,
};

export { login };
