const mongoose = require(`mongoose`);

const jerseyReturnSchema = {
  $id: `jersey`,
  type: `object`,
  properties: {
    number: { type: `number` },
    male_quota: { type: `number` },
    female_quota : { type: `number`}
  },
};

const jerseySchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true, index: 1 },
  male_quota: { type: Number, requried: true, default: 3 },
  female_quota: { type: Number, requried: true, default: 3 }
});

jerseySchema.query.format = async function () {
  const res = (await this.findOne()).toObject();

  return res;
};

const Jersey = mongoose.model(`Jersey`, jerseySchema);

module.exports = { Jersey, jerseyReturnSchema };
