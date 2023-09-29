const MODELS = `../models`;

const { Server } = require(`${MODELS}/server`);

async function isEligible(user, jersey) {
  if (
    user.isEligible === false ||
    user.bidding_round !== (await Server.findOne({ key: `round` })).value
  ) {
    return false;
  }
  if (jersey);
  return true;
}

module.exports = { isEligible };
