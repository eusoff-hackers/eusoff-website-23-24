const { env } = process;
import mongoose from 'mongoose';
import { IhgMatch } from '../models/ihgMatch';

async function run() {
  await mongoose.connect(env.MONGO_URI);

  await IhgMatch.create({
    red: `65a504e9d43128cddbacd78f`,
    blue: `65a5495ad43128cddbacd792`,
    sport: `652774950c06c264d5595d11`,
    timestamp: 1705331206000,
  });
  console.log(`Finished.`);
}

run();

export {};
