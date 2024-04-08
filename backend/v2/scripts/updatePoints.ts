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

const DISTRIBUTIONS = [
  'External CCA',
  "Dean's list",
  'cmc',
  'aca',
  'band',
  'choir',
  'drama',
  'edc',
  'dp main comm',
  'dp finance',
  'dp fr',
  'dp pubs',
  'dp mkt',
  'dp logs',
  'dp lights',
  'dp sounds',
  'dp sets',
  'dp sm',
  'dp choreo',
  'dp cast',
  'dp d1',
  'dp d2',
  'dp d3',
  'dp d4',
  'dp d5',
  'dp d6',
  'dp d7',
  'dp dc',
  'du afterdark',
  'du hot trio',
  'du smookin',
  'expeds',
  'es',
  'minds',
  'sa',
  'green comm',
  'smc',
  'badminton',
  'basketball',
  'floorball',
  'frisbee',
  'handball',
  'netball',
  'road relay',
  'takraw',
  'football',
  'softball',
  'squash',
  'swim',
  'table tennis',
  'tennis',
  'trug',
  'track',
  'volleyball',
  'tm',
  'a blk',
  'b blk',
  'c blk',
  'd blk',
  'e blk',
  'spt',
  'hrb',
  'hpb',
  'ew heads & logs',
  'ew photog',
  'ew vid',
  'ew audio',
  'ew design',
  'ew dmm',
  'ew cro',
  'audit',
  'elections',
  'finance',
  'hackers',
  'eer',
  'ehoc',
  'rag comm',
  'rag dancer',
  'flag',
];

interface Data {
  username: string;
  points: number;
  'External CCA': number;
  "Dean's list": number;
  cmc: number;
  aca: number;
  band: number;
  choir: number;
  drama: number;
  edc: number;
  'dp main comm': number;
  'dp finance': number;
  'dp fr': number;
  'dp pubs': number;
  'dp mkt': number;
  'dp logs': number;
  'dp lights': number;
  'dp sounds': number;
  'dp sets': number;
  'dp sm': number;
  'dp choreo': number;
  'dp cast': number;
  'dp d1': number;
  'dp d2': number;
  'dp d3': number;
  'dp d4': number;
  'dp d5': number;
  'dp d6': number;
  'dp d7': number;
  'dp dc': number;
  'du afterdark': number;
  'du hot trio': number;
  'du smookin': number;
  expeds: number;
  es: number;
  minds: number;
  sa: number;
  'green comm': number;
  smc: number;
  badminton: number;
  basketball: number;
  floorball: number;
  frisbee: number;
  handball: number;
  netball: number;
  'road relay': number;
  takraw: number;
  football: number;
  softball: number;
  squash: number;
  swim: number;
  'table tennis': number;
  tennis: number;
  trug: number;
  track: number;
  volleyball: number;
  tm: number;
  'a blk': number;
  'b blk': number;
  'c blk': number;
  'd blk': number;
  'e blk': number;
  spt: number;
  hrb: number;
  hpb: number;
  'ew heads & logs': number;
  'ew photog': number;
  'ew vid': number;
  'ew audio': number;
  'ew design': number;
  'ew dmm': number;
  'ew cro': number;
  audit: number;
  elections: number;
  finance: number;
  hackers: number;
  eer: number;
  ehoc: number;
  'rag comm': number;
  'rag dancer': number;
  flag: number;
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const csvFilePath = './v2/scripts/csv/points_formatted.csv';
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
        const res: Data[] = [];

        for (const user of result) {
          const tmp = await User.findOne({ username: user.username }).session(
            session,
          );
          if (!tmp || tmp.role !== 'USER') missing.push(user);
          else if ((await RoomBidInfo.countDocuments({ user: tmp._id })) !== 0) {
              await RoomBidInfo.updateOne(
                { user: tmp._id },
                {
                  user: tmp._id,
                  isEligible: false,
                  points: user.points,
                  pointsDistribution: DISTRIBUTIONS.map((k) => ({
                    cca: k,
                    points: user[k as keyof Data],
                  })).filter((c) => c.points && c.points !== '0'),
                },
              ).session(session);
            } else res.push(user);
        }

        console.log(
          'Missing users: ',
          missing.map((u) => u.username),
        );

        console.log(
          'Unupdated users: ',
          res.map((u) => u.username),
        );
        // await RoomBidInfo.create(res, { session });

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
