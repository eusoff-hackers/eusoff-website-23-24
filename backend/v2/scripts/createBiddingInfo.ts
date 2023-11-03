const { env } = process;
import mongoose from 'mongoose';
import { BiddingInfo } from '../models/biddingInfo';

async function run() {
  await mongoose.connect(env.MONGO_URI);

  await BiddingInfo.create({
    user: `653b7a975c1eaadf5dc55c9e`,
    round: 1,
    points: 1,
    allocated: false,
  });
  console.log(`Finished.`);
}

run();

export {};
