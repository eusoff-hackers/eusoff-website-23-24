import { FastifyReply, FastifyRequest } from 'fastify';
import { iUser } from '../models/user';

const MODELS_PATH = `../models`;
const { User } = require(`${MODELS_PATH}/user`);
const { sendStatus } = require(`./req_handler`);
const { reportError, logger } = require(`./logger`);
const { MongoSession } = require(`./mongoSession`);

declare module 'fastify' {
  interface Session {
    user?: iUser;
  }
}

async function auth(req: FastifyRequest, res: FastifyReply) {
  try {
    const session = new MongoSession();
    await session.start();
    try {
      if (!req.session?.user) {
        await sendStatus(res, 401, `Unauthorized.`);
        return;
      }
      const { user: userSession }: { user: iUser } = req.session as {
        user: iUser;
      };
      const user = await User.findById(userSession._id).session(
        session.session,
      );

      req.session.user = user;
      await req.session.save();
      logger.info(`Refreshed user: ${user._id}.`);
    } catch (error) {
      reportError(error, `Auth error`);
      await sendStatus(res, 500, `Internal Server Error.`);
      return;
    } finally {
      await session.end();
    }
  } catch (error) {
    reportError(error, `Mongo session error`);
    await sendStatus(res, 500, `Internal Server Error.`);
  }
}

async function login(user: iUser, req: FastifyRequest) {
  try {
    await req.session.regenerate();
    req.session.user = user;

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

export { login, auth, logout };
