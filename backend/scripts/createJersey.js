const env = process.env;

console.log(env);

const mongoose = require(`mongoose`);
const { Jersey } = require(`../models/jersey`);

async function run() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);
  const numbers = Array.from(Array.from({ length: 99 }, (_, i) => i + 1));
  await Jersey.deleteMany({});
  const jerseys = numbers.map((number) => {
    return { number };
  });
  return Jersey.create(jerseys);
}

run();
