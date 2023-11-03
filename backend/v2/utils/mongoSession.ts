import { FastifyInstance, FastifyRequest } from 'fastify';
import mongoose, { ClientSession } from 'mongoose';
import { logger } from './logger';

class MongoSession {
  #session: ClientSession | undefined;

  get session(): ClientSession {
    if (!this.#session) {
      throw new Error(`No session.`);
    }
    return this.#session as ClientSession;
  }

  async start() {
    this.#session = await mongoose.startSession();
    (this.#session as ClientSession).startTransaction({
      readConcern: { level: `snapshot` },
      writeConcern: { w: `majority`, j: true },
    });
  }

  async commit() {
    if (!this.#session) {
      throw new Error(`No session.`);
    }
    await (this.#session as ClientSession).commitTransaction();
  }

  async abort() {
    if (!this.#session) {
      throw new Error(`No session.`);
    }
    await (this.#session as ClientSession).abortTransaction();
  }

  async end() {
    try {
      if (!this.#session) {
        throw new Error(`No session.`);
      }
      await (this.#session as ClientSession).endSession();
    } catch (error) {
      logger.error(`Mongo end session error.`);
    }
  }
}

async function addSession(fastify: FastifyInstance) {
  fastify.addHook(`preHandler`, async (req: FastifyRequest) => {
    const session = new MongoSession();
    await session.start();
    req.session.set(`session`, session);
    return req.session.save();
  });
}

export { MongoSession, addSession };
