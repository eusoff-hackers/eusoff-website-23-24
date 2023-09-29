const MODELS = `../models`;

const { Server } = require(`${MODELS}/server`);
const { Ban } = require(`${MODELS}/ban`);

async function isEligible(user, jersey) {
  if (
    user.isEligible === false ||
    user.bidding_round !== (await Server.findOne({ key: `round` })).value
  ) {
    return false;
  }

  const { teams } = user;
  const bans = await Ban.find({
    $and: [
      {
        $or: teams.map((team) => ({ team })),
      },
      {
        $or: jersey.map((j) => ({ jersey: j._id })),
      },
    ],
  });

  if (bans.length !== 0) return false;
  return true;
}

module.exports = { isEligible };
