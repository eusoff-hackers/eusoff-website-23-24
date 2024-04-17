import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Room } from '../../models/room';
import { success, resBuilder, sendError } from '../../utils/req_handler';
import { logAndThrow, reportError } from '../../utils/logger';
import { RoomBlock } from '../../models/roomBlock';
import { RoomBid } from '../../models/roomBid';

const schema = {
  response: {
    200: resBuilder({
      type: `object`,
      properties: {
        rooms: {
          type: `array`,
          items: {
            $ref: `room`,
          },
        },
        blocks: {
          type: `array`,
          items: {
            $ref: `roomBlock`,
          },
        },
      },
      additionalProperties: false,
    }),
  },
} as const;

async function handler(req: FastifyRequest, res: FastifyReply) {
  const session = req.session.get(`session`)!;
  try {
    const rooms = await Room.find()
      .populate({
        path: `bidders`,
        select: `user info -room`,
        populate: [`user`, { path: `info`, select: `isEligible points -user` }],
      })
      .sort({ block: 1, number: 1 })
      .session(session.session)
      .lean();

    const blocks = logAndThrow(
      await Promise.allSettled(
        (await RoomBlock.find().lean()).map(async (b) => {
          const currentRooms = (await Room.find({ block: b.block })).map(
            (r) => r._id,
          );
          return {
            ...b,
            bidderCount: await RoomBid.count({ room: { $in: currentRooms } }),
          };
        }),
      ),
      `Block retrieve`,
    );

    return await success(res, { rooms, blocks });
  } catch (error) {
    reportError(error, `Room list handler error`);
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
