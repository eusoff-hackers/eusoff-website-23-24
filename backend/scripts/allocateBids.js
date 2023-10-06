const env = process.env;

console.log(env);

const mongoose = require(`mongoose`);
const { User } = require(`../models/user`);
const { Team } = require(`../models/team`);
const { Jersey } = require(`../models/jersey`);
const { Bid } = require(`../models/bid`);
const { isEligible } = require(`../utils/eligibilityChecker`);

async function jerseyBidCount(jerseyNumber, bid_priority) {
    await mongoose.connect(env.MONGO_URI);

    const get_bids = { priority: bid_priority } ;
    const bids = await Bid.find(get_bids);
    const number_of_bids = 0;
    
    bids.forEach(bid => {
        if (bid.jersey = jerseyNumber) {
            number_of_bids++
        }
    })
    return number_of_bids;
}

async function run() {
    await mongoose.connect(env.MONGO_URI), console.log(`Connected Atlas.`);

    for (let bid_priority = 1; bid_priority < 6; bid_priority++) {
        for (let current_number = 1; current_number < 100; current_number++) {
            const get_jerseys = { number: current_number, $or: [{ male_quota: { $ne: 0 } }, { female_quota: { $ne: 0 } }] };
            const jerseys = await Jersey.find(get_jerseys);
            
            const jerseyArray = [];
            jerseys.forEach((jersey) => {
                jerseyArray.push(jersey);
            });

            jerseyArray.sort(function(a, b){return jerseyBidCount(a, bid_priority) - jerseyBidCount(b, bid_priority)});
            jerseyArray.reverse();

            jerseyArray.forEach(async (jerseyNumber) => {
                const get_bids = { jersey : jerseyNumber, priority : bid_priority };
                const bids = await Bid.find(get_bids);
                const bidders = [];
                bids.forEach( (bid) => {
                    bidders.push(bid.user)
                });
                const eligible_bidders = bidders.filter(isEligible);
                eligible_bidders.sort(function(a, b) {
                    if ( a.points != b.points ) {
                        return a.points - b.points;
                    } else if ( a.year != b.year ) {
                        return a.year - b.year;
                    } else {
                        return 0;
                    }
                });

                while ( Array.isArray(eligible_bidders) && eligible_bidders.length ) {
                    /* need another way to check when to end loop cos must check the genders of the people left in the list also */
                    if (jerseyNumber.male_quota == 0 && jerseyNumber.female_quota == 0) {
                        break;
                    } else {
                        const person = eligible_bidders.pop();
                        /* findOneAndUpdate the database for this person, then do the same for the jersey to subtract quota*/
                    }
                };
            })
        }
    }
}
  
  
  run();