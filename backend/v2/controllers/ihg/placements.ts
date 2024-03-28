import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { IhgPlacement } from '../../models/ihgPlacement';
import { success, resBuilder, sendError } from '../../utils/req_handler';
import { reportError } from '../../utils/logger';

const schema = {
  response: {
    200: resBuilder({
      type: `array`,
      items: {
        $ref: `ihgPlacement`,
      },
    }),
  },
} as const;

async function handler(req: FastifyRequest, res: FastifyReply) {
  const session = req.session.get(`session`)!;
  try {
    const placements = await IhgPlacement.find()
      .populate(`hall`)
      .populate(`sport`)
      .session(session.session);
    return await success(res, placements);
  } catch (error) {
    reportError(error, `IHG placements handler error`);
    return sendError(res);
  } finally {
    await session.end();
  }
}

const placements: RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  Record<string, never>
> = {
  method: `GET`,
  url: `/placements`,
  schema,
  handler,
};

export { placements };
