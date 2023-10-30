const { env } = process;
import mongoose from 'mongoose';
import { Member } from '../models/member';

async function run() {
  await mongoose.connect(env.MONGO_URI);

  await Member.create({
    user: `653b7a975c1eaadf5dc55c9e`,
    team: `653b77273ea512a5b54c6b6b`,
  });
  console.log(`Finished.`);
}

run();

export {};
