import { BiddingInfo, iBiddingInfo } from '../models/biddingInfo';
import { iJersey } from '../models/jersey';
import { Member } from '../models/member';
import { JerseyBan } from '../models/jerseyBan';
import { Server, iServer } from '../models/server';
import { iUser } from '../models/user';
import { logAndThrow, logger, reportError } from './logger';
import { MongoSession } from './mongoSession';

async function checkUser(user: iUser, session: MongoSession): Promise<boolean> {
  try {
    const [isOpen, round, bidInfo]: [
      iServer | null,
      iServer | null,
      iBiddingInfo | null,
    ] = logAndThrow<iServer | iBiddingInfo | null>(
      await Promise.allSettled([
        Server.findOne({ key: `isOpen` }).session(session.session),
        Server.findOne({ key: `biddingRound` }).session(session.session),
        BiddingInfo.findOne({ user: user._id }).session(session.session),
      ]),
      `Getting server config error`,
    ) as [iServer | null, iServer | null, iBiddingInfo | null];

    if (!isOpen || !round || !bidInfo) {
      logger.error(`Check user find results are null | undefined`);
      throw new Error(`Some datas are null | undefined`);
    }

    if (
      bidInfo.round > (round.value as number) ||
      (isOpen.value as boolean) === false ||
      bidInfo.allocated
    )
      return false;

    return true;
  } catch (error) {
    reportError(error, `User eligiblity check error`);
    throw new Error(`User eligiblity check error`);
  }
}

async function isEligible(
  user: iUser,
  jerseys: iJersey[],
  session: MongoSession,
) {
  try {
    if ((await checkUser(user, session)) === false) return false;

    const teams = (
      await Member.find({ user: user._id })
        .lean()
        .populate(`team`)
        .session(session.session)
    ).map((team) => team.team._id);

    if (jerseys.some((j) => j.quota[user.gender] === 0)) {
      return false;
    }

    if (
      await JerseyBan.exists({
        team: { $in: teams },
        jersey: { $in: jerseys },
      }).session(session.session)
    ) {
      return false;
    } 
      return true;
    
  } catch (error) {
    reportError(error, `isEligible error`);
    throw new Error(`isEligible error`);
  }
}

export { checkUser, isEligible };
