const { User } = require(`../models/user`);
const { Server } = require(`../models/server`);
const mongoose = require(`mongoose`);

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const current_round = await Server.findOne({ key: `round` });
  const allocated = await User.find({
    $or: [{ bidding_round: 5 }, { bidding_round: current_round.value }],
  });
}
run();
