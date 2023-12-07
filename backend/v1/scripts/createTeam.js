const env = process.env;

console.log(env);

const mongoose = require(`mongoose`);
const { Team } = require(`../models/team`);

async function run() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);

  return Team.create({
    name: `Is Eusoff Hackers a team`,
  });
}

run();
