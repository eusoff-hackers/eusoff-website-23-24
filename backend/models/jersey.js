const mongoose = require(`mongoose`);

const returnSchema = {
  $id: `jersey`,
  type: `object`,
  required: [`number`],
  properties: {
    number: { type: `number` },
    quota: {
      type: `object`,
      properties: {
        Male: { type: `number` },
        Female: { type: `number` },
      },
    },
  },
  additionalProperties: false,
};

const jerseySchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true, index: 1 },
  quota: {
    Male: { type: Number, required: true, default: 3 },
    Female: { type: Number, required: true, default: 3 },
  },
});

jerseySchema.query.format = async function format() {
  const res = (await this.findOne()).toObject();

  return res;
};

const Jersey = mongoose.model(`Jersey`, jerseySchema);

module.exports = { Jersey, returnSchema };
