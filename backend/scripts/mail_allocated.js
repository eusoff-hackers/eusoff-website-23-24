const mongoose = require(`mongoose`);
const { User } = require(`../models/user`);
const { Server } = require(`../models/server`);

async function run() {
  console.log(process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI);

  const db = mongoose.connection;
  console.log(await User.find({}));
  console.log(`Connected Atlas.`);

  const current_round = (await Server.findOne({ key: `round` })).value;
  const allocated = await User.find({
    $and: [
      { $or: [{ bidding_round: 5 }, { bidding_round: current_round }] },
      { isEligible: false },
    ],
  });
}
run();
