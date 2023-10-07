const env = process.env;

console.log(env);

const mongoose = require(`mongoose`);
const { User } = require(`../models/user`);
const { Team } = require(`../models/team`);
const { Jersey } = require(`../models/jersey`);
const { Bid } = require(`../models/bid`);
const { isEligible } = require(`../utils/eligibilityChecker`);

async function jerseyBidCount(jersey, bid_priority) {
    await mongoose.connect(env.MONGO_URI);

    const get_bids = { priority: bid_priority, jersey: jersey } ;
    const bids = await Bid.find(get_bids);
    
    return bids.length;
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

            jerseyArray.forEach(async (jersey) => {
                const get_bids = { jersey : jersey, priority : bid_priority };
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

                const changes = true

                while ( changes ) {
                    if (jersey.male_quota == 0 && jersey.female_quota == 0) {
                        break;
                    } else {
                        changes = false;
                        eligible_bidders = eligible_bidders.filter(isEligible);
                        if ( Array.isArray(eligible_bidders) && eligible_bidders.length ) {
                            const person = eligible_bidders.pop();
                            const updated_person = User.findOneAndUpdate(
                                { username: person.username },
                                { allocatedNumber: jersey.number },
                                { isEligible: false },
                                { new: true },
                            );
                            if ( person.gender == `Male`) {
                                jersey.male_quota -= 1;
                            } else {
                                jersey.female_quota -= 1;
                            }
                            /*create ban object for teams user is in*/
                            updated_person.teams.forEach( (team) => {
                                const bannableTeams = ['Basketball M', 'Basketball F', 'Floorball M', 'Floorball M', 'Frisbee', 'Handball M', 'Handball F', 'Soccer M', 'Soccer F', 'Softball', 'Touch Rugby M', 'Touch Rugby M', 'Volleyball M', 'Volleyball F']
                                if ( bannableTeams.includes(team.name) ) {
                                    const newBan = new Ban({
                                        jersey: jersey,
                                        team: team,
                                      });
                                    newBan.save();
                                }
                            });
                            changes = true;
                        }  
                    }
                }
            });
        }
    }
}
  
  
run();