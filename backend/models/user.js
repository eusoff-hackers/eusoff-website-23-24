const MAX_BIDS = 5;
const mongoose = require(`mongoose`);
const { logger, logAndThrow } = require(`../utils/logger`);
const { Bid } = require('./bid');
const { Team } = require('./team');

function arrayLimit(arr) {
  return arr.length <= MAX_BIDS;
}

const returnSchema = {
  $id: `user`,
  type: `object`,
  properties: {
    username: { type: `string` },
    teams: {
      type: `array`,
      items: {
        $ref: `team`,
      },
    },
    bids: {
      type: `array`,
      maxItems: 5,
      items: {
        $ref: `bid`,
      },
    },
    isEligible: { type: `boolean` },
    role: { type: `string`, enum: [`USER`, `ADMIN`] },
    bidding_round: { type: `number`, minimum: 1, maximum: 4 },
    year: { type: `number`, minimum: 1, maximum: 5 },
    points: { type: `number`, minimum: 0, maximum: 99 },
    allocatedNumber: { type: `number`, minimum: 0, maximum: 99 },
    gender: { type: `string`, enum: [`Male`, `Female`] },
  },
};

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  teams: {
    type: [{ type: mongoose.Schema.Types.ObjectId, unique: true }],
    default: [],
  },
  bids: {
    type: [{ type: mongoose.Schema.Types.ObjectId, unique: true }],
    default: [],
    validate: [arrayLimit, `{PATH} exceeds limit of 5 bids.`],
  },
  jersey: { type: Number, default: undefined },
  isEligible: { type: Boolean, default: false },
  role: { type: String, enum: [`USER`, `ADMIN`], default: `USER` },
  bidding_round: { type: Number, min: 1, max: 4, required: true },
  year: { type: Number, min: 1, max: 5, required: true },
  points: { type: Number, min: 0, max: 99, required: true },
  allocatedNumber: { type: Number, min: 0, max: 99 },
  gender: { type: String, enum: [`Male`, `Female`] },
});

userSchema.query.format = async function format() {
  try {
    const res = (await this.findOne()).toObject();

    const promises = [
      Promise.allSettled(
        res.bids.map(async (bid) => Bid.findById(bid).format(res.username)),
      ),
      Promise.allSettled(res.teams.map(async (team) => Team.findById(team))),
    ];

    const jobs = await Promise.allSettled(promises);
    const primary = logAndThrow(jobs, `User format primary failed`);
    const results = primary.map((job) =>
      logAndThrow(job, `User format secondary failed`),
    );

    [res.bids, res.teams] = results;
    return res;
  } catch (error) {
    logger.error(`User format error: ${error.message}`, { error });
    throw new Error(`Format error`);
  }
};

const User = mongoose.model(`User`, userSchema);

module.exports = { User, returnSchema };
