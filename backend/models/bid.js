const mongoose = require(`mongoose`);

const bidReturnSchema = {
  $id: `bid`,
  type: `object`,
  properties: {
    user: { type: `string` },
  },
};

const bidSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  jersey: { type: mongoose.Schema.Types.ObjectId, required: true },
  priority: { type: Number, required: true },
});

bidSchema.query.format = async function () {
  const res = (await this.findOne()).toObject();
  res.user = res.user.toString();

  return res;
};

const Bid = mongoose.model(`Bid`, bidSchema);

module.exports = { Bid, bidReturnSchema };
