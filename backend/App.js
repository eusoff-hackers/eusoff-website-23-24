const { env } = process;
const LOG_LEVEL = env.NODE_ENV !== 'production';

const Fastify = require(`fastify`);
const mongoose = require(`mongoose`);
const { logger } = require(`./utils/logger`);
const router = require(`./routes/router`);
const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie');
const MongoStore = require('connect-mongo');

const { auth } = require(`./utils/auth`);

const crypto = require(`crypto`);

const fastify = Fastify({
  logger: LOG_LEVEL,
});

const secret = env.SESSION_SECRET || crypto.randomBytes(128).toString(`base64`);

fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  secret,
  store: MongoStore.create({
    mongoUrl: env.MONGO_URI,
    ttl: 7 * 24 * 60 * 60,
    autoRemove: `native`,
  }),
});

fastify.addHook(`onRequest`, auth);
fastify.register(router);

async function run() {
  try {
    await Promise.allSettled([
      mongoose.connect(env.MONGO_URI),
      fastify.listen(env.BACKEND_PORT, `0.0.0.0`),
    ]);

    logger.info(`Connected to Atlas.`);
    logger.info(`Server started, listening to ${env.BACKEND_PORT}`);
  } catch (error) {
    logger.error(`Error starting server: ${error.message}`, { error });
    process.exit(1);
  }
}

run();
