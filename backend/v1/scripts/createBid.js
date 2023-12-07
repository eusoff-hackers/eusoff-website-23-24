const env = process.env;

console.log(env);

const mongoose = require(`mongoose`);
const { Bid } = require(`../models/bid`);

async function run() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);

  return Bid.create({
    user: `65103b7c55c6cc52dfa3b57c`,
    jersey: `6513c9c7fe4921ac8da9c7ed`,
    priority: 5,
  });
}

run();
