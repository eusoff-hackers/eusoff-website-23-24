import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { BiddingInfo } from '../../models/biddingInfo';
import { Bid } from '../../models/bid';
import { success, resBuilder, sendError } from '../../utils/req_handler';
import { logAndThrow, reportError } from '../../utils/logger';
import { auth } from '../../utils/auth';

const schema = {
  response: {
    200: resBuilder({
      type: `object`,
      properties: {
        info: {
          $ref: `biddingInfo`,
        },
        bids: {
          type: `array`,
          maxItems: 5,
          items: {
            $ref: `bid`,
          },
        },
      },
    }),
  },
} as const;

async function handler(req: FastifyRequest, res: FastifyReply) {
  const session = req.session.get(`session`)!;
  try {
    const user = req.session.get(`user`)!;

    const p = await Promise.allSettled([
      BiddingInfo.findOne({ user: user._id })
        .populate(`jersey`)
        .session(session.session),
      Bid.find({ user: user._id }).populate(`jersey`).session(session.session),
    ]);
    const info = logAndThrow([p[0]], `Bid info retrieval error`)[0];
    const bids = logAndThrow([p[1]], `Bids parse error`)[0];

    if (info) info.user = undefined;

    return await success(res, { info, bids });
  } catch (error) {
    reportError(error, `Bid Info handler error`);
    return sendError(res);
  } finally {
    await session.end();
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
