import { FastifyInstance, FastifyRequest } from 'fastify';
import mongoose, { ClientSession } from 'mongoose';
import { logger, reportError } from './logger';

const ATTEMPT_LIMIT = 10;

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

  async attemptCommit(attemptN: number) {
    try {
      await (this.#session as ClientSession).commitTransaction();
    } catch (error) {
      reportError(error, `Commit error`);
      if (attemptN < ATTEMPT_LIMIT) await this.attemptCommit(attemptN + 1);
      else throw error;
    }
  }

  async commit() {
    if (!this.#session) {
      throw new Error(`No session.`);
    }
    await this.attemptCommit(0);
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
