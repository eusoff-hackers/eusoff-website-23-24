const env = process.env;

console.log(env);

const mongoose = require(`mongoose`);
const { Team } = require(`../models/team`);

async function run() {
  await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);

  const teamData = [
    { name: 'Badminton M', shareable: true },
    { name: 'Badminton F', shareable: true },
    { name: 'Basketball M', shareable: false },
    { name: 'Basketball F', shareable: false },
    { name: 'Floorball M', shareable: false },
    { name: 'Floorball F', shareable: false },
    { name: 'Frisbee', shareable: false },
    { name: 'Handball M', shareable: false },
    { name: 'Handball F', shareable: false },
    { name: 'Netball', shareable: true },
    { name: 'Road Relay M', shareable: true },
    { name: 'Road Relay F', shareable: true },
    { name: 'Soccer M', shareable: false },
    { name: 'Soccer F', shareable: false },
    { name: 'Softball', shareable: false },
    { name: 'Squash M', shareable: true },
    { name: 'Squash F', shareable: true },
    { name: 'Takraw', shareable: true },
    { name: 'Swim M', shareable: true },
    { name: 'Swim F', shareable: true },
    { name: 'Table Tennis M', shareable: true },
    { name: 'Table Tennis F', shareable: true },
    { name: 'Tennis M', shareable: true },
    { name: 'Tennis F', shareable: true },
    { name: 'Touch Rugby M', shareable: false },
    { name: 'Touch Rugby F', shareable: false },
    { name: 'Track M', shareable: true },
    { name: 'Track F', shareable: true },
    { name: 'Volleyball M', shareable: false },
    { name: 'Volleyball F', shareable: false },
  ];

  const teamsToCreate = [];
  for (let i = 0; i < 30; i++) {
    const teamInfo = teamData[i % teamData.length];
    const team = new Team(teamInfo);
    teamsToCreate.push(team);
  }

  Team.insertMany(teamsToCreate)
    .then(() => {
      console.log('Created 30 teams.');
    })
    .catch((error) => {
      console.error('Error creating teams: ', error);
    });
}

run();
