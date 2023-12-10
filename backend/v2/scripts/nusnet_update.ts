/* eslint-disable no-console */

import { parse } from 'csv-parse';
import * as fs from 'fs';
import { User } from '../models/user';
import mongoose from 'mongoose';
import { createObjectCsvWriter } from 'csv-writer';

interface Data {
  'Name Preferred': string;
  Gender: 'Male' | 'Female';
  Nationality: string;
  'Year of Study': number;
  NUSNET: string;
  Email: string;
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
  const csvFilePath = './v2/scripts/csv/new_2324_jersey_bidding.csv';

  const csvWriter = createObjectCsvWriter({
    path: 'v2/scripts/csv/formatted_data.csv',
    header: [
      { id: 'Name Preferred', title: 'Name Preferred' },
      { id: 'Gender', title: 'Gender' },
      { id: 'Nationality', title: 'Nationality' },
      { id: 'Year of Study', title: 'Year of Study' },
      { id: 'NUSNET', title: 'NUSNET' },
      { id: 'Email', title: 'Email' },
      { id: 'Room Type', title: 'Room Type' },
      { id: 'Room Space', title: 'Room Space' },
      { id: 'Room no', title: 'Room no' },
      { id: 'IHG 2324', title: 'IHG 2324' },
      { id: 'Final cut 2223', title: 'Final cut 2223' },
      { id: 'Captain', title: 'Captain' },
      { id: 'First cut 2324', title: 'First cut 2324' },
      { id: 'Total points', title: 'Total points' },
    ],
  });

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
        if (!(await User.exists({ email: user.Email }))) {
          console.error(`User not found: ${user}`);
        }

        const email = user.Email.split('@')[0];

        const data = (await (
          await fetch(`/* take from site*/`)
        ).json()) as Body;

        const result = data.Body.ResultSet;
        if (result.length > 1) {
          console.error(`Received more than 1 result: ${user}`);
        } else if (result.length === 0) {
          console.error(`Refceived 0 result: ${user}`);
          continue;
        }

        if (
          result[0].DisplayName.toLowerCase() !==
          user['Name Preferred'].toLowerCase()
        ) {
          console.error(
            `Name mismatch: ${user['Name Preferred']} AND ${result[0].DisplayName}`,
          );
        }

        const nusnet = result[0].Nickname;
        user.NUSNET = nusnet;
        await csvWriter.writeRecords([user]);
        console.log(`success: ${email}`);
      }

      console.log(`Finished.`);
    },
  );
})();
