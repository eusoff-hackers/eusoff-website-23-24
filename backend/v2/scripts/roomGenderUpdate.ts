/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import mongoose from 'mongoose';
import { Room } from '../models/room';

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const session = await mongoose.startSession();

  await session.startTransaction({
    readConcern: { level: `snapshot` },
    writeConcern: { w: `majority`, j: true },
  });

  try {
    const rooms = await Room.find().session(session);
    console.log(rooms);

    for (const { number, _id } of rooms) {
      const gender = number / 100 >= 2 && number / 100 < 4 ? `Female` : `Male`;
      await Room.findOneAndUpdate(
        { _id },
        { allowedGenders: [gender] },
      ).session(session);
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
