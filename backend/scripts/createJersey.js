const env = process.env;

console.log(env);

const mongoose = require(`mongoose`);
const { Jersey } = require(`../models/jersey`);
const readline = require(`readline`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function run() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);
  rl.question(`Enter jersey start number: `, (start) => {
    rl.question(`Enter jersey end number: `, async (end) => {
      [start, end] = [parseInt(start), parseInt(end)];
      if (start > end) {
        console.error(`Start cannto be larger than end.`);
        return;
      }

      const numbers = Array.from(
        Array.from({ length: end - start + 1 }, (_, i) => i + start),
      );
      await Jersey.deleteMany({});
      const jerseys = numbers.map((number) => {
        return { number };
      });
      await Jersey.create(jerseys);
      console.log(`Created jerseys.`);
    });
  });
}

run();
