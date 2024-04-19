/* eslint-disable no-console */
/* eslint-disable no-promise-executor-return */

import mongoose from 'mongoose';
import { RoomBidInfo, iRoomBidInfo } from '../models/roomBidInfo';

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function try1(i: iRoomBidInfo) {
  const session = await mongoose.startSession();

  await session.startTransaction({
    readConcern: { level: `snapshot` },
    writeConcern: { w: `majority`, j: true },
  });

  try {
    await timeout(500);
    const tmp = await RoomBidInfo.findOne({ _id: i._id }).session(session);
    if (tmp) {
      tmp.points = 22;
      await tmp.save({ session });
    }
    await timeout(500);
    // await RoomBidInfo.findOneAndUpdate({_id: i._id}, {points: 15}).session(session);
    // await timeout(500);
    try {
      await session.commitTransaction();
      console.log('saved1');
    } catch (e) {
      await session.abortTransaction();
      console.error(e);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await session.endSession();
  }
}

async function try2(i: iRoomBidInfo) {
  const session = await mongoose.startSession();

  await session.startTransaction({
    readConcern: { level: `snapshot` },
    writeConcern: { w: `majority`, j: true },
  });

  try {
    await timeout(500);
    const tmp = await RoomBidInfo.findOne({ _id: i._id }).session(session);
    if (tmp) {
      tmp.points = 220;
      await tmp.save({ session });
    }
    // await RoomBidInfo.findOneAndUpdate({_id: i._id}, {points: 16}).session(session);
    await timeout(500);
    try {
      await session.commitTransaction();
      console.log('saved2');
    } catch (e) {
      await session.abortTransaction();
      console.error(e);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await session.endSession();
  }
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const i = await RoomBidInfo.findById(`661e7ecd383324dc410b51ab`);

  if (!i) return;
  try1(i);
  await timeout(100);
  try2(i);
  console.log(`finis`);
})();
