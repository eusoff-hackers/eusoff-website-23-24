import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { success, resBuilder, sendError } from '../../utils/req_handler';
import { reportError, logAndThrow } from '../../utils/logger';
import { IhgPlacement } from '../../models/ihgPlacement';
import { Hall } from '../../models/hall';
import { setCache, checkCache } from '../../utils/cache_handler';

const POINTS_REWARD = {
  carnival: [0, 6, 5, 4, 3, 2, 1],
  nonCarnival: [0, 5, 4, 3, 3, 1, 1],
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
          golds: { type: `number` },
          silvers: { type: `number` },
          bronzes: { type: `number` },
        },
        additionalProperties: false,
      },
    }),
  },
} as const;

async function handler(req: FastifyRequest, res: FastifyReply) {
  const session = req.session.get(`session`)!;
  try {
    const halls = await Hall.find().session(session.session);
    const ret = logAndThrow(
      await Promise.allSettled(
        halls.map(async (h) => {
          const placements = await IhgPlacement.find({ hall: h._id })
            .populate(`sport`)
            .session(session.session);

          if (!placements) return { hall: h, points: 0 };

          let points = 0;
          let golds = 0;
          let silvers = 0;
          let bronzes = 0;
          placements.forEach((p) => {
            if (p.sport.isCarnival) {
              points += POINTS_REWARD.carnival[p.place];
            } else {
              points += POINTS_REWARD.nonCarnival[p.place];
            }

            switch (p.place) {
              case 1:
                golds += 1;
                break;
              case 2:
                silvers += 1;
                break;
              case 3:
                bronzes += 1;
                break;
              default:
            }
          });

          return { hall: h, points, golds, silvers, bronzes };
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
  preHandler: checkCache,
  handler,
  onSend: setCache,
};

export { points };
