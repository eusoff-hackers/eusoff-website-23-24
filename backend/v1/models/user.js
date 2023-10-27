// const MAX_BIDS = 5;
const mongoose = require(`mongoose`);
const { logger } = require(`../utils/logger`);
require(`./member.js`);

// function arrayLimit(arr) {
//   return arr.length <= MAX_BIDS;
// }

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
    bidding_round: { type: `number`, minimum: 1, maximum: 5 },
    year: { type: `number`, minimum: 1, maximum: 5 },
    points: { type: `number`, minimum: 0, maximum: 99 },
    allocatedNumber: { type: `number`, minimum: 0, maximum: 99 },
    gender: { type: `string`, enum: [`Male`, `Female`] },
  },
  additionalProperties: false,
};

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // teams: {
    //   type: [{ type: mongoose.Schema.Types.ObjectId /* unique: true */ }],
    //   default: [],
    //   ref: 'Team',
    // },
    // bids: {
    //   type: [{ type: mongoose.Schema.Types.ObjectId /* unique: true */ }],
    //   default: [],
    //   validate: [arrayLimit, `{PATH} exceeds limit of 5 bids.`],
    //   ref: `Bid`
    // },
    jersey: { type: Number, default: undefined },
    isEligible: { type: Boolean, default: false },
    role: { type: String, enum: [`USER`, `ADMIN`], default: `USER` },
    bidding_round: { type: Number, min: 1, max: 5, required: true },
    year: { type: Number, min: 1, max: 5, required: true },
    points: { type: Number, min: 0, max: 99, required: true },
    allocatedNumber: { type: Number, min: 0, max: 99 },
    gender: { type: String, enum: [`Male`, `Female`] },
    email: { type: String },
  },
  {
    toObject: { virtuals: true },
  },
);

userSchema.virtual(`bids`, {
  ref: `Bid`,
  localField: `_id`,
  foreignField: `user`,
});

userSchema.virtual(`teams`, {
  ref: `Member`,
  localField: `_id`,
  foreignField: `user`,
});

userSchema.query.format = async function format(session) {
  try {
    const res = (
      await this.findOne()
        .populate({
          path: `bids`,
          populate: { path: `jersey` },
          options: {
            sort: {
              priority: 1,
            },
          },
        })
        .populate({
          path: `teams`,
          populate: {
            path: `team`,
          },
          transform: (team) => team?.team,
        })
        .session(session)
    ).toObject();

    return res;
  } catch (error) {
    logger.error(`User format error: ${error.message}`, { error });
    throw new Error(`Format error`);
  }
};

const User = mongoose.model(`User`, userSchema);

module.exports = { User, returnSchema };
