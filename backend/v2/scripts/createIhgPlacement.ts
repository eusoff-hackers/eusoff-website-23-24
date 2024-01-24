const { env } = process;
import mongoose from 'mongoose';
import { IhgPlacement } from '../models/ihgPlacement';
import { IhgSport } from '../models/ihgSport';
import { Hall } from '../models/hall';

async function run() {
  await mongoose.connect(env.MONGO_URI);

  const halls = await Hall.find();
  const sports = await IhgSport.find();

  await IhgPlacement.create({
    hall: halls[0],
    sport: sports[0],
    place: 3,
  });

  console.log(`Finished.`);
}

run();

export {};
