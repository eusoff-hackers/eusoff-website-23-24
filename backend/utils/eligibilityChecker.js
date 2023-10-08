const MODELS = `../models`;

const { Server } = require(`${MODELS}/server`);
const { Ban } = require(`${MODELS}/ban`);
const { Jersey } = require(`${MODELS}/jersey`);

async function userEligible(user) {
  if (
    user.isEligible === false ||
    user.bidding_round !== (await Server.findOne({ key: `round` })).value
  ) {
    return false;
  }
  return true;
}

async function isEligible(user, jersey) {
  const { teams } = user;
  if (teams.length === 0 || jersey.length === 0) return true;

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

async function getEligible(user) {
  if ((await userEligible(user)) === false) {
    return [];
  }
  const { teams } = user;
  const banned = (await Ban.find({ team: { $in: teams } })).map(
    (ban) => ban.jersey,
  );

  const eligibleJerseys = (await Jersey.find({ _id: { $nin: banned } })).map(
    (jersey) => jersey.number,
  );
  return eligibleJerseys;
}

module.exports = { isEligible, getEligible };
