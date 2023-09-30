const mongoose = require(`mongoose`);

const serverSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: 1 },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
});

const Server = mongoose.model(`Server`, serverSchema);

module.exports = { Server };
