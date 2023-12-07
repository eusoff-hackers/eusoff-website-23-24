const env = process.env;

const mongoose = require(`mongoose`);
const { Member } = require(`../models/member`);

async function run() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);

  return Member.create({
    user: `65103b7c55c6cc52dfa3b57c`,
    team: `6513caa2537f3bbf463c3a4e`,
  });
}

run();
