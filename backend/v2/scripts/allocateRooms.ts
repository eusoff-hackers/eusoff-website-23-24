/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */

import mongoose, { ClientSession } from 'mongoose';
import { RoomBidInfo } from '../models/roomBidInfo';
import { iUser } from '../models/user';
import { RoomBid, iRoomBid } from '../models/roomBid';
import { validateRooms } from '../utils/room';
import { Room, iRoom } from '../models/room';
import { RoomBlock } from '../models/roomBlock';

async function compute(bid: iRoomBid, session: ClientSession) {
  const { user, info, room: oldRoom } = bid;
  const room = await Room.findById(oldRoom!._id).session(session);
  const block = await RoomBlock.findOne({ block: room?.block }).session(
    session,
  );
  if (!room || !block) {
    throw new Error(`Room ${oldRoom} not found.`);
  }

  if (info?.isAllocated !== false || info?.isEligible !== true) {
    throw new Error(`User ineligible`);
  }

  if (!validateRooms(user as iUser, [room as iRoom])) {
    console.log(`${(user as iUser).username} lost due to room quota`);
    return;
  }

  if (block.quota === 0) {
    console.log(`${(user as iUser).username} lost due to block quota`);
    return;
  }

  console.log(
    `Allocating ${room!.block}${room.number} to ${(user as iUser).username}`,
  );
  room!.occupancy += 1;
  await room!.save({ session });
  block.quota -= 1;
  await block.save({ session });
  await RoomBidInfo.findOneAndUpdate(
    { user: user!._id },
    { isAllocated: true, room: room!._id },
  ).session(session);
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const session = await mongoose.startSession();

  await session.startTransaction({
    readConcern: { level: `snapshot` },
    writeConcern: { w: `majority`, j: true },
  });

  try {
    const rooms = await Room.find()
      .session(session)
      .populate({ path: `bidders`, populate: `info` });

    const draw: iRoom[] = [];
    for (const room of rooms) {
      const { bidders, capacity, occupancy } = room;
      const n = capacity - occupancy;
      if (n >= bidders!.length || n <= 0) continue;
      if (bidders![n].info!.points === bidders![n - 1].info!.points) {
        draw.push(room);
      }
    }

    if (draw.length > 0) {
      throw new Error(`Draw found: ${draw}`);
    }

    const bids = (
      await RoomBid.find()
        .session(session)
        .populate(`room`)
        .populate(`info`)
        .populate(`user`)
    ).sort((a, b) => b.info!.points - a.info!.points);
    console.log(`Found ${bids.length} bids.`);

    for (const bid of bids) {
      await compute(bid, session);
    }

    try {
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      console.error(e);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await session.endSession();
  }

  console.log(`Finished.`);
})();
