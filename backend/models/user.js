const MAX_BIDS = 5;
const mongoose = require(`mongoose`);

function arrayLimit(arr) {
  return arr.length <= MAX_BIDS;
}

const userReturnSchema = {
  $id: `user`,
  type: `object`,
  properties: {
    username: { type: `string` },
    teams: {
      type: `array`,
      items: {
        type: `string`,
      },
    },
    bids: {
      type: `array`,
      maxItems: 5,
      items: {
        type: `string`,
      },
    },
    isEligible: { type: `boolean` },
    role: { type: `string`, enum: [`USER`, `ADMIN`] },
    year: { type: `number`, minimum: 1, maximum: 5 },
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
  year: { type: Number, min: 1, max: 5, required: true },
});

userSchema.query.format = async function () {
  const res = (await this.findOne()).toObject();
  res.bids = res.bids.map((bids) => bids.toString());
  return res;
};

const User = mongoose.model(`User`, userSchema);

module.exports = { User, userReturnSchema };
