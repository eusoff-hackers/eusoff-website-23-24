const mongoose = require(`mongoose`);

const banSchema = new mongoose.Schema({
  jersey: { type: mongoose.Schema.Types.ObjectId, required: true },
  team: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const Ban = mongoose.model(`Ban`, banSchema);

module.exports = { Ban };
