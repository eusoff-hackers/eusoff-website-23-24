import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

import { success, resBuilder, sendError } from '../../utils/req_handler';
import { reportError } from '../../utils/logger';
import { auth } from '../../utils/auth';

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
    const user = req.session.get(`user`);
    return await success(res, { user });
  } catch (error) {
    reportError(error, `Error user info handler`);
    return sendError(res);
  } finally {
    await req.session.get(`session`)?.end();
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
  preHandler: auth,
  handler,
};

export { info };
