const env = process.env;

console.log(env);

const mongoose = require(`mongoose`);
const { Server } = require(`../models/server`);

async function run() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);

  return Server.create({
    key: `round`,
    value: 1,
  });
}

run();
