/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import { parse } from 'csv-parse';
import * as fs from 'fs';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User, iUser } from '../models/user';

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
  const csvFilePath = './v2/scripts/csv/passworded.csv';
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
      const res: iUser[] = [];
      for (const user of result) {
        user.password = await hashPassword(user.password);
        res.push(user as iUser);
      }
      try {
        await User.create(res, { session });

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
