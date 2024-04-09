import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { FromSchema } from 'json-schema-to-ts';
import { iRoom } from '../../models/room';
import { sendError, sendStatus } from '../../utils/req_handler';
import { reportError, logEvent } from '../../utils/logger';
import { isEligible, parseRooms } from '../../utils/room';
import { RoomBid } from '../../models/roomBid';
import { auth } from '../../utils/auth';

const schema = {
  body: {
    type: `object`,
    required: [`rooms`],
    properties: {
      rooms: {
        type: `array`,
        maxItems: 3,
        uniqueItems: true,
        items: {
          $ref: `room`,
        },
      },
    },
    additionalProperties: false,
  },
} as const;

type iRooms = FromSchema<typeof schema.body>;
type iBody = Omit<iRooms, keyof { rooms: iRoom[] }> & { rooms: iRoom[] };

async function handler(
  req: FastifyRequest<{ Body: iBody }>,
  res: FastifyReply,
) {
  const session = req.session.get(`session`)!;
  try {
    const user = req.session.get(`user`)!;

    const { valid, rooms } = await parseRooms(
      req.body.rooms.map((r) => r._id),
      session,
    );
    if (!valid || !(await isEligible(user, session))) {
      return await sendStatus(res, 400, `Ineligible for a room bid.`);
    }

    const newBids = rooms.map((room, i) => ({
      user: user._id,
      room: room._id,
      priority: i,
    }));

    await RoomBid.deleteMany({ user: user._id }).session(session.session);
    await RoomBid.create(newBids, { session: session.session });

    await logEvent(
      `USER PLACE ROOM BID`,
      session,
      JSON.stringify(newBids),
      user._id,
    );

    try {
      await session.commit();
    } catch (error) {
      reportError(error, `Room Bid create transaction commit error.`);
      await session.abort();
      return await sendStatus(res, 429, `Try again in a few moments`);
    }

    return await sendStatus(res, 200, `Bid saved.`);
  } catch (error) {
    reportError(error, `Room Bid Creation handler error`);
    return sendError(res);
  } finally {
    await session.end();
  }
}

const bid: RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  { Body: iBody }
> = {
  method: `POST`,
  url: `/bid`,
  schema,
  preHandler: auth,
  handler,
};

export { bid };
