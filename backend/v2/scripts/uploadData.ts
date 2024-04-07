/* eslint-disable no-console */

import { parse } from 'csv-parse';
import * as fs from 'fs';
import { User, iUser } from '../models/user';
import { Jersey } from '../models/jersey';
import { Member } from '../models/member';
import { BiddingInfo } from '../models/biddingInfo';
import mongoose, { Types } from 'mongoose';
import { createObjectCsvWriter } from 'csv-writer';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

interface Data {
  username: string;
  role: string;
  gender: string;
  year: number;
  room: string;
  email: string;
  password: string;
}

async function hashPassword(password: string) {
  const hashedPw = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPw;
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const csvFilePath = './v2/scripts/csv/23_24_formatted.csv';
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
      let res: iUser[] = [];
      for (let user of result) {
        user.password = await hashPassword(user.password);
        res.push(user as iUser);
      }
      const session = await mongoose.startSession();

      await session.startTransaction({
        readConcern: { level: `snapshot` },
        writeConcern: { w: `majority`, j: true },
      });
      try {
        await User.create(res, { session });

        try {
          await session.commitTransaction();
        } catch (error) {
          await session.abortTransaction();
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        await session.endSession();
      }

      console.log(`Finished.`);
    },
  );
})();
