const mongoose = require(`mongoose`);

const { Jersey } = require(`./jersey`);

const returnSchema = {
  $id: `bid`,
  type: `object`,
  required: [`jersey`],
  properties: {
    user: { type: `string` },
    jersey: { $ref: `jersey` },
    priority: { type: `number` },
  },
  additionalProperties: false,
};

const bidSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  jersey: { type: mongoose.Schema.Types.ObjectId, required: true },
  priority: { type: Number, required: true },
});

bidSchema.query.format = async function format(username) {
  const res = (await this.findOne()).toObject();

  res.user = username;
  res.jersey = await Jersey.findById(res.jersey);
  return res;
};

const Bid = mongoose.model(`Bid`, bidSchema);

module.exports = { Bid, returnSchema };
