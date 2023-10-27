import { FastifyReply, FastifyRequest } from 'fastify';
import { iUser } from '../models/user';

const MODELS_PATH = `../models`;
const { User } = require(`${MODELS_PATH}/user`);
const { sendStatus } = require(`./req_handler`);
const { reportError, logger } = require(`./logger`);
const MongoSession = require(`./mongoSession`);

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
      if (!(await req.session.get(`user`))) {
        await sendStatus(res, 401, `Unauthorized.`);
        return;
      }
      const { user: userSession } = req.session as { user: iUser };
      const user = await User.findById(userSession._id).session(
        session.session,
      );

      await req.session.set(`user`, user);
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
    await req.session.set(`user`, user);

    
  } catch (error) {
    reportError(error, `Login error`);
    throw error;
  }
}

async function logout(req: FastifyRequest) {
  try {
    await req.session.regenerate();

    
  } catch (error) {
    reportError(error, `Logout error`);
    throw error;
  }
}

export { login, auth, logout };
