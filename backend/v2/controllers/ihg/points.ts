import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { success, resBuilder, sendError } from '../../utils/req_handler';
import { reportError, logAndThrow } from '../../utils/logger';
import { IhgPlacement } from '../../models/ihgPlacement';
import { Hall } from '../../models/hall';

const POINTS_REWARD = {
  carnival: [0, 1, 2, 3, 4, 5, 6],
  nonCarnival: [0, 1, 1, 3, 3, 4, 5],
};

const schema = {
  response: {
    200: resBuilder({
      type: `array`,
      items: {
        type: `object`,
        required: [`hall`, `points`],
        properties: {
          hall: { $ref: `hall` },
          points: { type: `number` },
        },
        additionalProperties: false,
      },
    }),
  },
} as const;

async function handler(req: FastifyRequest, res: FastifyReply) {
  const session = req.session.get(`session`)!;
  try {
    const halls = await Hall.find();
    const ret = logAndThrow(
      await Promise.allSettled(
        halls.map(async (h) => {
          const placements = await IhgPlacement.find({ hall: h._id }).populate(
            `sport`,
          );

          if (!placements) return { hall: h, points: 0 };

          let points = 0;
          placements.forEach((p) => {
            if (p.sport.isCarnival) {
              points += POINTS_REWARD.carnival[p.place];
            } else {
              points += POINTS_REWARD.nonCarnival[p.place];
            }
          });

          return { hall: h, points };
        }),
      ),
      `IHG points calculation`,
    );

    return await success(res, ret);
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
