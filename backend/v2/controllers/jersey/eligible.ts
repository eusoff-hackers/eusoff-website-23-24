import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { getEligible } from '../../utils/jersey';
import { success, sendError, resBuilder } from '../../utils/req_handler';
import { reportError } from '../../utils/logger';
import { auth } from '../../utils/auth';

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
} as const;

async function handler(req: FastifyRequest, res: FastifyReply) {
  const session = req.session.get(`session`)!;
  try {
    const user = req.session.get(`user`)!;
    const jerseys = await getEligible(user, session);

    return await success(res, { jerseys });
  } catch (error) {
    reportError(error, `Jersey Eligible handler error`);
    return sendError(res);
  } finally {
    await session.end();
  }
}

const eligible: RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  Record<string, never>
> = {
  method: `GET`,
  url: `/eligible`,
  schema,
  preHandler: auth,
  handler,
};

export { eligible };
