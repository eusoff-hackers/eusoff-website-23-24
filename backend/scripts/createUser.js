const env = process.env;

console.log(env);

const mongoose = require(`mongoose`);
const { User } = require(`../models/user`);
const bcrypt = require(`bcryptjs`);

async function run() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);

  return User.create({
    username: `C114`,
    password: await bcrypt.hash(`bigcoock`, 10),
    bids: [],
    year: 1,
    role: `USER`,
    teams: [],
    isEligible: false,
    points: 12,
    bidding_round: 2,
  });
}

run();
