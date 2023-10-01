const env = process.env;

console.log(env);

const mongoose = require(`mongoose`);
const { User } = require(`../models/user`);
const { Team } = require(`../models/team`);
const { Jersey } = require(`../models/jersey`);
const { Bid } = require(`../models/bid`);

async function number_of_bids_for_jersey(jersey, bid_priority) {
    await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);

    const get_bids = { priority: bid_priority } ;
    const bids = await Bid.find(get_bids);
    const number_of_bids = 0;
    
    bids.forEach(bid => {
        if (bid.jersey = jersey) {
            number_of_bids++
        }
    })
    return number_of_bids
}

async function run() {
    await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);
  
    for (let round = 1; round < 5; round++) {
        for (let bid_priority = 1; bid_priority < 6; bid_priority++) {
            for (let current_number = 1; current_number < 100; current_number++) {
                const get_jerseys = { number: current_number, $or: [{ male_quota: { $ne: 0 } }, { female_quota: { $ne: 0 } }] }
                const jerseys = await Jersey.find(get_jerseys);
                
                const jerseyArray = []
                jerseys.forEach(jersey => {
                    jerseyArray.push(jersey)
                })

                jerseyArray.sort(function(a, b){return number_of_bids_for_jersey(a, bid_priority) - number_of_bids_for_jersey(b, bid_priority)})
                jerseyArray.reverse()
            }
        }
    }
  }
  
  run();