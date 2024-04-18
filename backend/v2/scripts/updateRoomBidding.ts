/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */

import { parse } from 'csv-parse';
import * as fs from 'fs';
import mongoose from 'mongoose';
import { User } from '../models/user';
import { RoomBidInfo } from '../models/roomBidInfo';

interface Data {
  'Full Name': string;
  'Matric Number': string;
  'Room Bidding Points': number;
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const csvFilePath = './v2/scripts/csv/room_bidding_list.csv';
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

  parse(
    fileContent,
    {
      delimiter: ',',
      columns: true,
    },
    async (error, result: Data[]) => {
      if (error) {
        console.error(error);
      }
      const session = await mongoose.startSession();

      await session.startTransaction({
        readConcern: { level: `snapshot` },
        writeConcern: { w: `majority`, j: true },
      });
      try {
        const missing: Data[] = [];

        for (const user of result) {
          const tmp = await User.findOne({
            username: user['Matric Number'],
          }).session(session);
          if (!tmp) missing.push(user);
          else {
            if ((await RoomBidInfo.countDocuments({ user: tmp._id })) === 0) {
              missing.push(user);
              continue;
            }
            await RoomBidInfo.findOneAndUpdate(
              { user: tmp._id },
              { isEligible: true, points: user['Room Bidding Points'] },
            );
          }
        }

        console.log(
          'Missing users: ',
          missing.map((u) => u['Matric Number']),
        );

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
    },
  );
})();
