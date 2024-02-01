import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Cca } from '../../models/cca';
import { success, resBuilder, sendError } from '../../utils/req_handler';
import { reportError } from '../../utils/logger';

const schema = {
  response: {
    200: resBuilder({
      type: `array`,
      items: {
        $ref: `cca`,
      },
    }),
  },
} as const;

async function handler(req: FastifyRequest, res: FastifyReply) {
  const session = req.session.get(`session`)!;
  try {
    const cca = await Cca.find().session(session.session);
    return await success(res, cca);
  } catch (error) {
    reportError(error, `Cca list handler error`);
    return sendError(res);
  } finally {
    await session.end();
  }
}

const list: RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  Record<string, never>
> = {
  method: `GET`,
  url: `/list`,
  schema,
  handler,
};

export { list };
