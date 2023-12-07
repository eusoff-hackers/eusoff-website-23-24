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
let writeStream;
// GLOBAL VARIABLES
const csvFilePath = '../csv_files/';
const nameToRoomNoMap = {}; // Map with name as the key and room number as the value
let userPassCSV = ''; // Store the CSV filename to save user passwords to

async function makeUsers() {
  rl.question(
    'Please enter the csv filename to create users: ',
    (csvFileName) => {
      // './2324_jersey_bidding.csv'

      const doubleRooms = [];

      let processing = 0;

      const stream = fs
        .createReadStream(csvFilePath + csvFileName)
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
            password: await generatePassword(roomNo, row['Email']), // Added email in,
            email: row['Email'],
          };

          nameToRoomNoMap[row['Name Preferred']] = roomNo;

          const user = new User(userData);

          try {
            await user.save();
            console.log('User saved successfully:', user.username);
          } catch (error) {
            console.error('Error saving user to MongoDB:', error);
          }

          processing--;

          if (processing === 0) {
            stream.emit(`finalEnd`);
          }
        })
        .on('finalEnd', () => {
          console.log('User data uploaded.');
          addTeams();
        });
      rl.close();
    },
  );
}

async function addTeams() {
  const newRl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  newRl.question(
    'Please enter name of csv file with sports: ',
    (csvFileName) => {
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
            let teams = [];
            for (const sport of roomNoToSportsMap[roomNo]) {
              const team = await Team.findOne({ name: sport });
              if (team) {
                teams.push(team._id);
              } else {
                console.error(`WARNING, CANNOT FIND TEAM: ${sport}.`);
              }
            }

            try {
              const newUser = await User.findOneAndUpdate(
                { username: roomNo },
                { teams },
                { new: true },
              );
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

  writeStream.write(`${roomNo},${originalPassword},${email}\n`);

  const hashedPw = await bcrypt.hash(originalPassword, SALT_ROUNDS);
  return hashedPw;
}

async function run() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);
  rl.question(
    'Please enter the csv file name to save user passwords to: ',
    (a) => {
      userPassCSV = a;
      writeStream = fs.createWriteStream(csvFilePath + userPassCSV, {
        flags: 'a',
      });
      writeStream.write(`username,password,email\n`);
      makeUsers();
    },
  );
}

run();
