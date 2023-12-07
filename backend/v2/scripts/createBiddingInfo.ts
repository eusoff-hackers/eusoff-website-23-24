const { env } = process;
import mongoose from 'mongoose';
import { BiddingInfo } from '../models/biddingInfo';

async function run() {
  await mongoose.connect(env.MONGO_URI);

  await BiddingInfo.create({
    user: `65103b7c55c6cc52dfa3b57c`,
    round: 1,
    points: 1,
    allocated: false,
  });
  console.log(`Finished.`);
}

run();

export {};
