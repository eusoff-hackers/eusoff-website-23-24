const mongoose = require(`mongoose`);
const { env } = process;
const { User } = require(`../models/user`);
const bcrypt = require(`bcryptjs`);

async function run() {
  await mongoose.connect(env.MONGO_URI);

  await User.create({
    username: 'C111',
    password: await bcrypt.hash(`mediumcoock`, 10),
    year: 1,
    role: `ADMIN`,
    gender: `Female`,
    email: `haha@gmail.com`,
  });
  console.log(`Finished.`);
}

run();

export {};
