const mongoose = require(`mongoose`);
const env = process.env;
const readline = require('readline');
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const xkpasswd = require('xkpasswd');
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

    const doubleRooms = [];

    fs.createReadStream(csvFilePath + csvFileName)
      .on('error', (err) => {
        console.error('Error reading the CSV file:', err);
      })
      .pipe(csv())
      .on('data', async (row) => {
        let roomNo = row['Room no'];
        const isDoubleRoom = row['Room Type'] === 'Double';

        if (isDoubleRoom && doubleRooms.includes(roomNo)) {
          roomNo += 'b'; // not the first time we see this room
        } else if (isDoubleRoom) {
          doubleRooms.push(roomNo);
          roomNo += 'a'; // first time
        }

        const userData = {
          gender: row['Gender'],
          year: parseInt(row['Year of Study'].charAt(0), 10),
          username: roomNo,
          bidding_round: 4 - parseInt(row['IHG 2324'], 10),
          points: parseInt(row['Total points'], 10),
          password: await generatePassword(roomNo, row['Email']), // Added email in
        };

        const user = new User(userData);

        user
          .save()
          .then((savedUser) => {
            console.log('User saved successfully:', savedUser.username);
          })
          .catch((err) => {
            console.error('Error saving user to MongoDB:', err);
          });
      })
      .on('end', () => {
        console.log('User data uploaded.');
      });

    rl.close();
  });
}

async function generatePassword(roomNo, email) {
  const SALT_ROUNDS = 10;
  const originalPassword =
    roomNoo + '-' + xkpasswd({ complexity: 1, separators: '-' });

  // NEED UPDATE FILENAME
  const writeStream = fs.createWriteStream(
    '../csv_files/sample_user_pass.csv',
    { flags: 'a' },
  );
  writeStream.write(`"${roomNo}", "${originalPassword}", "${email}"\n`);
  writeStream.end();

  const hashedPw = await bcrypt.hash(originalPassword, SALT_ROUNDS);
  return hashedPw;
}

run();
