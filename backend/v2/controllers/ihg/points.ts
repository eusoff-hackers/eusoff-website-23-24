import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { IhgPoint } from '../../models/ihgPoint';
import { success, resBuilder, sendError } from '../../utils/req_handler';
import { reportError } from '../../utils/logger';

const schema = {
  response: {
    200: resBuilder({
      type: `array`,
      items: {
        $ref: `ihgPoint`,
      },
    }),
  },
} as const;

async function handler(req: FastifyRequest, res: FastifyReply) {
  const session = req.session.get(`session`)!;
  try {
    const points = await IhgPoint.find().sort({
      gold: -1,
      silver: -1,
      bronze: -1,
    });
    return await success(res, points);
  } catch (error) {
    reportError(error, `Ihg points handler error`);
    return sendError(res);
  } finally {
    await session.end();
  }
}

const points: RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  Record<string, never>
> = {
  method: `GET`,
  url: `/points`,
  schema,
  handler,
};

export { points };
