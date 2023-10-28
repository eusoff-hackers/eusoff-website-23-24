import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

const UTILS_PATH = `../../utils`;

const { success, sendStatus, resBuilder } = require(
  `${UTILS_PATH}/req_handler`,
);
const { reportError } = require(`${UTILS_PATH}/logger`);

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
} as const;

async function handler(req: FastifyRequest, res: FastifyReply) {
  try {
    const { user } = req.session;
    return await success(res, { user });
  } catch (error) {
    reportError(`Error user info handler`);
    return sendStatus(res, 500, `Internal Server Error.`);
  }
}

const info: RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  Record<string, never>
> = {
  method: `GET`,
  url: `/info`,
  schema,
  handler,
};

export { info };
