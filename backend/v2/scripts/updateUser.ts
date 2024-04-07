// const mongoose = require(`mongoose`);
// const { env } = process;
// const { User } = require(`../models/user`);
// const { RoomBidInfo } = require(`../models/roomBidInfo`);

// async function run() {
//   await mongoose.connect(env.MONGO_URI);
//   const { _id } = await User.findOne({ username: 'C112' });

//   await RoomBidInfo.updateOne(
//     { user: _id },
//     {
//       pointsDistribution: [{ cca: 'typing', points: 1 }],
//     },
//   );
//   console.log(`Finished.`);
// }

// run();

// export {};
