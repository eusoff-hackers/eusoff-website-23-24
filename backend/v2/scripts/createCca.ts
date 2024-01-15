const mongoose = require(`mongoose`);
const { env } = process;
const { Cca } = require(`../models/cca`);

async function run() {
  await mongoose.connect(env.MONGO_URI);

  await Cca.create({ name: `Eating` });
  console.log(`Finished.`);
}

run();

export {};
