const MAX_BIDS = 5;
const mongoose = require(`mongoose`);

function arrayLimit(arr) {
  return arr.length <= MAX_BIDS;
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bids: {
    type: [{ type: mongoose.Schema.Types.ObjectId, unique: true }],
    default: [],
    validate: [arrayLimit, `{PATH} exceeds limit of 5 bids.`],
  },
  jersey: { type: Number, default: undefined },
});

const User = mongoose.model(`User`, userSchema);

module.exports = { User };
