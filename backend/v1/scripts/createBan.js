const env = process.env;

console.log(env);

const mongoose = require(`mongoose`);
const { Ban } = require(`../models/ban`);

async function run() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);

  return Ban.create({
    team: `6513caa2537f3bbf463c3a4e`,
    jersey: `65165d62aeb6d5646024e0a7`,
  });
}

run();
