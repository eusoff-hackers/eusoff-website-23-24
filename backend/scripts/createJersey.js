const env = process.env;

console.log(env);

const mongoose = require(`mongoose`);
const { Jersey } = require(`../models/jersey`);

async function run() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);

  return Jersey.create({
    number: 33,
  });
}

run();
