const mongoose = require(`mongoose`);
const { env } = process;
const { Team } = require(`../models/team`);

async function run() {
  await mongoose.connect(env.MONGO_URI);

  await Team.create({
    name: `Eusoff Hacker is not a team :(`,
    shareable: true,
  });
  console.log(`Createds team.`);
}

run();

export {};
