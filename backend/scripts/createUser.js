const env = process.env;

console.log(env);

const mongoose = require(`mongoose`);
const { User } = require(`../models/user`);
const bcrypt = require(`bcryptjs`);

async function run() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);

  return User.create({
    username: `C112`,
    password: await bcrypt.hash(`smallcoock`, 10),
  });
}

run();
