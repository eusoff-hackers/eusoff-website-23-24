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

async function jerseyBidCount(jersey, bid_priority) {
  const get_bids = { priority: bid_priority, jersey: jersey._id };
  const bids = await Bid.find(get_bids);

  return bids.length;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function checkRemaining() {
  console.log(`Checking users that have not been allocated a jersey`);

  const users = await User.find({ isEligible: true });
  console.log(
    `Users that do not have a jersey: ${users.map((u) => u.username)}`,
  );

  logAndThrow(
    await Promise.allSettled(
      users.map(async (user) => {
        user.bidding_round += 1;
        user.bidding_round = Math.min(user.bidding_round, 5);
        await user.save();
      }),
    ),
  );

  console.log(`Moved all unallocated users to next round.`);
}

async function allocateUser(bidder, jersey) {
  if (!(await isEligible(bidder, [jersey]))) {
    console.error(
      `\x1b[31m%s\x1b[0m`,
      `WARNING: cancelling allocation of ineligible user: ${bidder.username}.`,
    );
    return;
  }
  console.log(`Allocating jersey ${jersey.number} to ${bidder.username}`);

  const updated_bidder = await User.findOneAndUpdate(
    { username: bidder.username },
    { allocatedNumber: jersey.number, isEligible: false },
    { new: true },
  );
  if ((await Server.findOne({ key: `round` })).value === 1) {
    jersey.quota[bidder.gender] = 0;
  } else {
    jersey.quota[bidder.gender] -= 1;
  }
  await jersey.save();

  /*create ban object for teams user is in*/
  logAndThrow(
    await Promise.allSettled(
      updated_bidder.teams.map(async (teamId) => {
        const team = await Team.findById(teamId);
        if (team.shareable === false) {
          console.log(
            `Creating ban for ${team.name} and ${updated_bidder.username}`,
          );
          await Ban.create({
            jersey: jersey._id,
            team: team._id,
          });
        }
      }),
    ),
  );
}

async function checkRound5() {
  const users = await User.find({ bidding_round: 5, isEligible: true });
  if (users.length === 0) {
    console.log(`No eligible users with bidding round 5, safe!`);
    return;
  }

  rl.question(
    `There are eligible round 5 users (those at round 4 and are not yet allocated a number yet, would you like to randomly allocate them numbers? (y/n)`,
    async (prompt) => {
      if (prompt !== `y`) return;
      const shuffledUsers = shuffle(users);
      for (let i = 0; i < shuffledUsers.length; i++) {
        let user = users[i];
        user.bidding_round--;
        const jerseys = await getEligible(user);

        if (jerseys.length === 0) {
          console.error(
            `\x1b[31m%s\x1b[0m`,
            `WARNING: User ${user.username} cannot be allocated a number/jersey!`,
          );
          continue;
        }

        const idx = Math.floor(Math.random() * (jerseys.length - 1));

        await allocateUser(
          user,
          await Jersey.findOne({ number: jerseys[idx] }),
        );
      }

      console.log(`Finished randomly allocating users.`);
      rl.close();
    },
  );
}

async function allocate(jersey, bid_priority) {
  console.log(
    `Allocating jersey ${jersey.number} with priority ${bid_priority}`,
  );
  const get_bids = { jersey: jersey._id, priority: bid_priority };
  const bids = await Bid.find(get_bids);
  let bidders = logAndThrow(
    await Promise.allSettled(
      bids.map(async (b) => await User.findById(b.user)),
    ),
  );
  bidders.sort(function (a, b) {
    if (a.points != b.points) {
      return a.points - b.points;
    } else if (a.year != b.year) {
      return a.year - b.year;
    } else {
      return Math.random() - 0.5;
    }
  });

  let changes = true;

  while (changes) {
    if (jersey.quota.Male === 0 && jersey.quota.Female === 0) {
      break;
    } else {
      changes = false;
      bidders = logAndThrow(
        await Promise.allSettled(
          bidders.map(async (b) => {
            return { bidder: b, eligible: await isEligible(b, [jersey]) };
          }),
        ),
      );
      bidders = bidders
        .filter((bidder) => bidder.eligible)
        .map((b) => b.bidder);

      if (Array.isArray(bidders) && bidders.length) {
        const bidder = bidders.pop();

        await allocateUser(bidder, jersey);
        changes = true;
      }
    }
  }
}

async function run() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);

  for (let bid_priority = 0; bid_priority < 5; bid_priority++) {
    const get_jerseys = {
      $or: [{ quota: { Male: { $ne: 0 } } }, { quota: { Female: { $ne: 0 } } }],
    };
    const jerseys = logAndThrow(
      await Promise.allSettled(
        (await Jersey.find()).map(async (j) => {
          const bidders = await jerseyBidCount(j, bid_priority);
          return { jersey: j, bidders: bidders };
        }),
      ),
    );
    const sortedJerseys = jerseys
      .sort(function (a, b) {
        return b.bidders - a.bidders;
      })
      .map(({ jersey }) => jersey);
    console.log(`Sorted jerseys: ${sortedJerseys.map((j) => j.number)}`);
    // sortedJerseys.forEach(async (jersey) => {
    //   await allocate(jersey, bid_priority);
    // });
    for (let i = 0; i < sortedJerseys.length; i++) {
      await allocate(sortedJerseys[i], bid_priority);
    }
  }

  console.log(`Allocation complete :) I hope it's correct?`);

  await checkRemaining();
  await checkRound5();
}

run();
