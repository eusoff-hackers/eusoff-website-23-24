const mongoose = require(`mongoose`);

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: `User` },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: `Team`,
  },
});

const Member = mongoose.model(`Member`, memberSchema);

module.exports = { Member };
