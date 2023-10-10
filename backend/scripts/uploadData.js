const mongoose = require(`mongoose`);
const fs = require('fs');
const csv = require('csv-parser');
const { User } = require(`../models/user`);

async function run() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);

  const csvFilePath = './2324_jersey_bidding.csv';

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      const userData = {
        gender: row['Gender'],
        year: parseInt(row['Year of Study'].charAt(0), 10),
        username: row['Room no'],
        bidding_round: 4 - parseInt(row['IHG 2324'], 10),
        points: parseInt(row['Total points'], 10),
        password: generatePassword(row['Room no']), // Generate then add the password here?
      };

      const user = new User(userData);

      user.save((err) => {
        if (err) {
          console.error('Error saving user:', err);
        } else {
          console.log('User saved successfully:', user);
        }
      });
    })
    .on('end', () => {
      console.log('User data uploaded.');
    });
}

run();
