/* eslint-disable no-console */

import { parse } from 'csv-parse';
import * as fs from 'fs';
import { User, iUser } from '../models/user';
import { Jersey } from '../models/jersey';
import { Member } from '../models/member';
import { BiddingInfo } from '../models/biddingInfo';
import mongoose, { Types } from 'mongoose';
import { createObjectCsvWriter } from 'csv-writer';

interface Data {
  'Name Preferred': string;
  Gender: 'Male' | 'Female';
  Nationality: string;
  'Year of Study': number;
  NUSNET: string;
  Email: string;
  'Room no': string;
}

interface oldUser extends iUser {
  bidding_round: number;
  points: number;
  allocatedNumber: number;
  teams: Types.ObjectId[];
}

interface Suggestion {
  Nickname: string;
  DisplayName: string;
}

interface Body {
  Body: { ResultSet: Suggestion[] };
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const csvFilePath = './v2/scripts/csv/formatted_data.csv';
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
      for (let user of result) {
        const old = (await User.findOne({
          email: user.Email,
        }))!.toObject() as oldUser;
        if (!old) {
          console.error(`USER NOT FOUND: ${user}`);
          continue;
        }

        await User.updateOne(
          { email: user.Email },
          {
            $set: { username: user.NUSNET, room: user['Room no'] },
            $unset: {
              teams: 1,
              bids: 1,
              isEligible: 1,
              bidding_round: 1,
              points: 1,
              allocatedNumber: 1,
            },
          },
          { strict: false },
        );
        // await BiddingInfo.create({
        //   user: old._id,
        //   round: old.bidding_round,
        //   points: old.points,
        //   allocated: true,
        //   jersey: (await Jersey.findOne({number: old.allocatedNumber}))!._id
        // });

        // const newTeams = Promise.allSettled(old.teams.map(t => {Member.create({user: old._id, team: t})}));
      }

      console.log(`Finished.`);
    },
  );
})();
