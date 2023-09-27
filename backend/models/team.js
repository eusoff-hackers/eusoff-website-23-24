const mongoose = require(`mongoose`);

const teamReturnSchema = {
  $id: `team`,
  type: `object`,
  properties: {
    name: { type: `string` },
  },
};

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: 1 },
});

teamSchema.query.format = async function () {
  const res = (await this.findOne()).toObject();

  return res;
};

const Team = mongoose.model(`Team`, teamSchema);

module.exports = { Team, teamReturnSchema };
