'use strict';

const env = process.env;

const readline = require('readline');
const mongoose = require(`mongoose`);
const { User } = require(`../models/user`);
const { Team } = require(`../models/team`);
const { Jersey } = require(`../models/jersey`);
const { Bid } = require(`../models/bid`);
const { Ban } = require(`../models/ban`);
const { Server } = require(`../models/server`);
const { isEligible, getEligible } = require(`../utils/eligibilityChecker`);
const { logAndThrow } = require('../utils/logger');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function run() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);

  rl.question(`Delete all bids? (y/n) `, async (ans) => {
    await User.updateMany({}, { bids: [] });
    await Bid.deleteMany({});
    console.log(`Deleted all bids.`);
  });
}

run();
