const mongoose = require(`mongoose`);
const env = process.env;
const readline = require('readline');
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const xkpasswd = require('xkpasswd');
const { User } = require(`../models/user`);
const { Team } = require('../models/team');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Map with name as the key and room number as the value
const nameToRoomNoMap = {};

async function makeUsers() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);

  rl.question('Please enter name of csv file: ', (csvFileName) => {
    const csvFilePath = '../csv_files/';
    // './2324_jersey_bidding.csv'

    const doubleRooms = [];

    let processing = 0;
    const stream = fs.createReadStream(csvFilePath + csvFileName)
      .on('error', (err) => {
        console.error('Error reading the CSV file:', err);
      })
      .pipe(csv())
      .on('data', async (row) => {
        processing++;
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

        nameToRoomNoMap[row['Name Preferred']] = roomNo;

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
    addTeams();
  });
}

async function addTeams() {
  const newRl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  newRl.question(
    'Please enter name of csv file with sports: ',
    (csvFileName) => {
      const csvFilePath = '../csv_files/';

      // Map with roomNo as the key and sports array as the value
      let roomNoToSportsMap = {};

      fs.createReadStream(csvFilePath + csvFileName)
        .on('error', (err) => {
          console.error('Error reading the CSV file:', err);
        })
        .pipe(csv())
        .on('data', (row) => {
          const name = row['NAME OF PLAYER'];
          const sport = row['Sport'];
          const roomNo = nameToRoomNoMap[name];

          if (!roomNoToSportsMap[roomNo]) {
            roomNoToSportsMap[roomNo] = [];
          }
          roomNoToSportsMap[roomNo].push(sport);
        })
        .on('end', async () => {
          for (const roomNo in roomNoToSportsMap) {
            const teams = [];
            

            for (const sport of roomNoToSportsMap[roomNo]) {
              const team = await Team.findOne({ name: sport });

              if (team && user) {
                teams.push(team._id);
              }
            }

            try {
              const newUser = await User.findOneAndUpdate({username: roomNo}, {teams}, {new: true});
              console.log(`Updated teams for user: ${newUser.username}`);
            } catch (error) {
              console.error(`Error updating user ${roomNo}:`, error);
            }
          }
          console.log('User data updated with teams.');
        });

      newRl.close();
    },
  );
}

async function generatePassword(roomNo, email) {
  const SALT_ROUNDS = 10;
  const originalPassword =
    roomNo + '-' + xkpasswd({ complexity: 1, separators: '-' });

  // NEED UPDATE FILENAME
  const writeStream = fs.createWriteStream(
    '../csv_files/sample_user_pass.csv',
    { flags: 'a' },
  );
  writeStream.write(`${roomNo},${originalPassword},${email}\n`);
  writeStream.end();

  const hashedPw = await bcrypt.hash(originalPassword, SALT_ROUNDS);
  return hashedPw;
}

makeUsers();
