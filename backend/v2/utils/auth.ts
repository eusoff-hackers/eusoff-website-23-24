import { FastifyReply, FastifyRequest } from 'fastify';
import { iUser, User } from '../models/user';
import { sendStatus } from './req_handler';
import { reportError, logger } from './logger';
import { MongoSession } from './mongoSession';

declare module 'fastify' {
  interface Session {
    user: iUser;
    session: MongoSession;
  }
}

async function auth(req: FastifyRequest, res: FastifyReply) {
  const session = req.session.get(`session`)!;
  try {
    if (!req.session?.user) {
      await sendStatus(res, 401, `Unauthorized.`);
      return false;
    }
    const { user: userSession }: { user: iUser } = req.session as {
      user: iUser;
    };

    const user = (await User.findById(userSession._id).session(
      session.session,
    ))!;

    req.session.set(`user`, user);
    await req.session.save();
    logger.info(`Refreshed user: ${user._id}.`);
    return true;
  } catch (error) {
    reportError(error, `Auth error`);
    await sendStatus(res, 500, `Internal Server Error.`);
    return false;
  }
}

async function admin(req: FastifyRequest, res: FastifyReply) {
  try {
    if (!(await auth(req, res))) return;

    if (req.session?.user?.role !== `ADMIN`) {
      await sendStatus(res, 401, `Unauthorized.`);
      return;
    }

    logger.info(`Authorized admin on: ${req.session.user._id}`);
  } catch (error) {
    reportError(error, `Admin auth error.`);
    await sendStatus(res, 500, `Internal Server Error.`);
  }
}

async function login(user: iUser, req: FastifyRequest) {
  try {
    await req.session.regenerate();
    req.session.set(`user`, user);

    await req.session.save();
  } catch (error) {
    reportError(error, `Login error`);
    throw error;
  }
}

async function logout(req: FastifyRequest) {
  try {
    await req.session.regenerate();

    await req.session.save();
  } catch (error) {
    reportError(error, `Logout error`);
    throw error;
  }
}

export { login, auth, logout, admin };
