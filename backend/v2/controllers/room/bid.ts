import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server as httpServer, ServerResponse } from 'http';
import { FromSchema } from 'json-schema-to-ts';
import { Room, iRoom } from '../../models/room';
import { sendError, sendStatus } from '../../utils/req_handler';
import { reportError, logEvent, logAndThrow } from '../../utils/logger';
import { validateRooms, isEligible, parseRooms } from '../../utils/room';
import { RoomBid } from '../../models/roomBid';
import { auth } from '../../utils/auth';
import { mail } from '../../utils/mailer';
import { RoomBidInfo } from '../../models/roomBidInfo';
import { Server } from '../../models/server';
import { MongoSession } from '../../utils/mongoSession';
import { iUser } from '../../models/user';

const schema = {
  body: {
    type: `object`,
    required: [`rooms`],
    properties: {
      rooms: {
        type: `array`,
        maxItems: 1,
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

async function alert(
  room: iRoom,
  session: MongoSession,
  alertInterval: number,
) {
  const users = (await Room.findById(room._id)
    .populate({ path: `bidders`, populate: [`user`, `info`] })
    .session(session.session))!.bidders!.sort(
    (u, v) => v.info!.points - u.info!.points,
  );

  const n = room.capacity - room.occupancy;
  if (n >= users.length) return false;
  const limit = users[n].info!.points;

  const fUsers = users
    .filter(
      (u) => u.info!.lastAlertMail.getTime() + alertInterval <= Date.now(),
    )
    .filter((u) => u.info!.points <= limit);

  logAndThrow(
    await Promise.allSettled(
      fUsers.map(async (u) => {
        await RoomBidInfo.findOneAndUpdate(
          { user: u.user?._id },
          { lastAlertMail: Date.now() },
        ).session(session.session);

        const body = [
          `Please review your bid for the room <strong>${room.block}${room.number}</strong> as soon as possible to ensure you maintain the highest bid. This is your chance to secure your preferred room.`,
          `To update your bid, please visit our bidding page and save your new preference before the deadline.`,
        ];

        const { email, username, _id } = u.user as iUser;

        await mail(
          {
            subject: `Urgent Alert: Risk of Being Outbidded`,
            title: `Alert: You are in danger of being outbidded!`,
            body,
            email,
            username,
            userId: _id,
          },
          session,
        );
      }),
    ),
    `Alert mail send`,
  );

  return true;
}

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

    if (!valid) {
      return await sendStatus(res, 400, `Invalid room(s).`);
    }

    if (!(await isEligible(user, session))) {
      return await sendStatus(res, 400, `Ineligible for a room bid.`);
    }
    if (!(await validateRooms(user, rooms))) {
      return await sendStatus(res, 400, `Ineligible room(s).`);
    }

    const newBids = rooms.map((room, i) => ({
      user: user._id,
      room: room._id,
      priority: i,
    }));

    await RoomBid.deleteMany({ user: user._id }).session(session.session);
    await RoomBid.create(newBids, { session: session.session });

    const bidInfo = await RoomBidInfo.findOne({ user: user._id });
    const saveInterval = await Server.findOne({
      key: `roomBidMailSaveInterval`,
    });
    const alertInterval = await Server.findOne({
      key: `roomBidMailAlertInterval`,
    });

    if (
      saveInterval &&
      bidInfo!.lastSaveMail.getTime() + (saveInterval.value as number) <=
        Date.now() &&
      rooms.length > 0
    ) {
      await RoomBidInfo.findOneAndUpdate(
        { user: user._id },
        { lastSaveMail: Date.now() },
      ).session(session.session);

      const body = [
        `We appreciate you taking the time to place your bid with us. You have bid for the following room: <strong>${rooms[0].block}${rooms[0].number}</strong>.`,
        `We will notify you if any issues arise. Please make sure to check your spam folder and add us to your trusted sender list to receive all our communications.`,
      ];

      await mail(
        {
          subject: `Thank You for Bidding!`,
          title: `Your bid has successfully been saved!`,
          body,
          email: user.email,
          username: user.username,
          userId: user._id,
        },
        session,
      );
    }

    if (alertInterval)
      logAndThrow(
        await Promise.allSettled(
          rooms.map((r) => alert(r, session, alertInterval.value as number)),
        ),
        `Room bid alert mail`,
      );

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
  httpServer,
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
