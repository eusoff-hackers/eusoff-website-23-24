import mongoose, { ClientSession } from 'mongoose';

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
    if (!this.#session) {
      throw new Error(`No session.`);
    }
    (this.#session as ClientSession).endSession();
  }
}

export { MongoSession };
