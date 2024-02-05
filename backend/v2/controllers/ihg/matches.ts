import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { IhgMatch } from '../../models/ihgMatch';
import { success, resBuilder, sendError } from '../../utils/req_handler';
import { reportError } from '../../utils/logger';

const schema = {
  response: {
    200: resBuilder({
      type: `array`,
      items: {
        $ref: `ihgMatch`,
      },
    }),
  },
} as const;

async function handler(req: FastifyRequest, res: FastifyReply) {
  const session = req.session.get(`session`)!;
  try {
    console.log(new Date());
    const matches = await IhgMatch.find({ timestamp: { $gt: new Date() } })
      .populate(`red`)
      .populate(`blue`)
      .populate(`sport`)
      .session(session.session);
    return await success(res, matches);
  } catch (error) {
    reportError(error, `IHG matches handler error`);
    return sendError(res);
  } finally {
    await session.end();
  }
}

const matches: RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  Record<string, never>
> = {
  method: `GET`,
  url: `/matches`,
  schema,
  handler,
};

export { matches };
