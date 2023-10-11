const mongoose = require(`mongoose`);
const env = process.env;
const readline = require('readline');
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User } = require(`../models/user`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function run() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);

  rl.question('Please enter name of csv file: ', (csvFileName) => {
    const csvFilePath = '../csv_files/';
    // './2324_jersey_bidding.csv'

    fs.createReadStream(csvFilePath + csvFileName)
      .pipe(csv())
      .on('data', async (row) => {
        const userData = {
          gender: row['Gender'],
          year: parseInt(row['Year of Study'].charAt(0), 10),
          username: row['Room no'],
          bidding_round: 4 - parseInt(row['IHG 2324'], 10),
          points: parseInt(row['Total points'], 10),
          password: await generatePassword(row['Room no'], row['Email']), // Added email in
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

    rl.close();
  });
}

async function generatePassword(room_no, email) {
  const SALT_ROUNDS = 10;
  const originalPassword = room_no + generateRandomString(7);

  // NEED UPDATE FILENAME
  const writeStream = fs.createWriteStream(
    '../csv_files/sample_user_pass.csv',
    { flags: 'a' },
  );
  writeStream.write(`"${room_no}", "${originalPassword}", "${email}"\n`);
  writeStream.end();

  const hashedPw = await bcrypt.hash(originalPassword, SALT_ROUNDS);
  return hashedPw;
}

// Helper function to make random string
function generateRandomString(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

run();
