import { BiddingInfo, iBiddingInfo } from '../models/biddingInfo';
import { iJersey, Jersey } from '../models/jersey';
import { Member } from '../models/member';
import { JerseyBan } from '../models/jerseyBan';
import { Server, iServer } from '../models/server';
import { iUser } from '../models/user';
import { logAndThrow, logger, reportError } from './logger';
import { MongoSession } from './mongoSession';

async function checkUser(user: iUser, session: MongoSession): Promise<boolean> {
  try {
    const [bidOpen, round, bidInfo]: [
      iServer | null,
      iServer | null,
      iBiddingInfo | null,
    ] = logAndThrow<iServer | iBiddingInfo | null>(
      await Promise.allSettled([
        Server.findOne({ key: `bidOpen` }).session(session.session),
        Server.findOne({ key: `biddingRound` }).session(session.session),
        BiddingInfo.findOne({ user: user._id }).session(session.session),
      ]),
      `Getting server config error`,
    ) as [iServer | null, iServer | null, iBiddingInfo | null];

    if (!bidOpen || !round || !bidInfo) {
      logger.error(`Check user find results are null | undefined`);
      throw new Error(`Some datas are null | undefined`);
    }

    if (
      bidInfo.round > (round.value as number) ||
      (bidOpen.value as boolean) === false ||
      bidInfo.allocated
    )
      return false;

    return true;
  } catch (error) {
    reportError(error, `User eligiblity check error`);
    throw new Error(`User eligiblity check error`);
  }
}

async function getTeams(user: iUser, session: MongoSession) {
  return (
    await Member.find({ user: user._id })
      .lean()
      .populate(`team`)
      .session(session.session)
  ).map((team) => team.team._id);
}

async function isEligible(
  user: iUser,
  jerseys: iJersey[],
  session: MongoSession,
) {
  try {
    if ((await checkUser(user, session)) === false) return false;

    const teams = await getTeams(user, session);

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

async function getEligible(
  user: iUser,
  session: MongoSession,
): Promise<number[]> {
  if ((await checkUser(user, session)) === false) {
    return [];
  }

  const teams = await getTeams(user, session);

  const banned = (
    await JerseyBan.find({ team: { $in: teams } }).session(session.session)
  ).map((ban) => ban.jersey);

  const eligibleJerseys = (await Jersey.find({ _id: { $nin: banned } }))
    .filter((j) => j.quota[user.gender] !== 0)
    .map((jersey) => jersey.number);

  return eligibleJerseys;
}

export { checkUser, isEligible, getEligible };
