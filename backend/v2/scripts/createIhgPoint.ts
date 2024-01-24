const { env } = process;
import mongoose from 'mongoose';
import { IhgPoint } from '../models/ihgPoint';
import { Hall } from '../models/hall';

async function run() {
  await mongoose.connect(env.MONGO_URI);

  const halls = await Hall.find();

  const points = halls.map((h) => ({
    hall: h._id,
  }));

  console.log(halls, points);
  await IhgPoint.create(points);

  console.log(`Finished.`);
}

run();

export {};
