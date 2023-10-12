const readline = require('readline');
const { User } = require('../models/user');
const mongoose = require(`mongoose`);
const { Server } = require('../models/server');
const env = process.env;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function run() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);
  rl.question('Please enter bidding round: ', async (round) => {
    // Convert 'round' to a number if needed
    round = parseInt(round);

    if (isNaN(round) || round < 1 || round > 4) {
      console.error(`Invalid bidding round: ${round}`);
      return;
    }

    console.log(`Setting isEligible to false for all users...`);
    // Add your logic here, for example, update the database
    await User.updateMany({}, { isEligible: false });
    console.log(`Finished setting isEligible to false for all users.`);

    console.log(`Setting server config to ${round}.`);
    await Server.findOneAndUpdate({ key: `round` }, { value: round });
    console.log(`Finished setting server config to ${round}.`);

    console.log(`Setting isEligible to true for eligible users...`);
    await User.updateMany({ bidding_round: round }, { isEligible: true });
    console.log(`Finished setting isEligible to true for eligible users.`);

    console.log(`Finished!`);

    rl.close(); // Close the readline interface
  });
}

run();
