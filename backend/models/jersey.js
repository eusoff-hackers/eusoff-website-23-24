const mongoose = require(`mongoose`);

const returnSchema = {
  $id: `jersey`,
  type: `object`,
  required: [`number`],
  properties: {
    number: { type: `number` },
    male_quota: { type: `number` },
    female_quota: { type: `number` },
  },
};

const jerseySchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true, index: 1 },
  male_quota: { type: Number, required: true, default: 3 },
  female_quota: { type: Number, required: true, default: 3 },
});

jerseySchema.query.format = async function format() {
  const res = (await this.findOne()).toObject();

  return res;
};

const Jersey = mongoose.model(`Jersey`, jerseySchema);

module.exports = { Jersey, returnSchema };
