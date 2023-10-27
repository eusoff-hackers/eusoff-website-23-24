const UTILS_PATH = `./utils`;

const { env } = process;
const LOG_LEVEL: boolean = env.NODE_ENV !== 'production';

const Fastify = require(`fastify`);
const mongoose = require(`mongoose`);
const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie');
const MongoStore = require('connect-mongo');
const IORedis = require('ioredis');

const RedisStore = require(`connect-redis`).default;
const { MongoClient } = require(`mongodb`);
const redis = require(`@fastify/redis`);
const caching = require(`@fastify/caching`);
const cors = require(`@fastify/cors`);
const crypto = require(`crypto`);
const abcache = require('abstract-cache');

const { logger, reportError } = require(`${UTILS_PATH}/logger`);
const v1 = require(`./v1/routes/router.js`);

const secret = env.SESSION_SECRET || crypto.randomBytes(128).toString(`base64`);

const fastify = Fastify({
  logger: LOG_LEVEL,
});

async function run() {
  try {
    await Promise.allSettled([
      mongoose.connect(env.MONGO_URI),
      fastify.listen(env.BACKEND_PORT, `0.0.0.0`),
    ]);

    logger.info(`Connected to Atlas.`);
    logger.info(`Server started, listening to ${env.BACKEND_PORT}`);
  } catch (error) {
    reportError(error, `Error starting server`);
    process.exit(1);
  }
}

async function register() {
  try {
    fastify.register(cors, {
      origin: env.FRONTEND_URL.split(','),
      methods: ['GET', 'PUT', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
      credentials: true,
      maxAge: 600,
      exposedHeaders: ['*', 'Authorization'],
    });

    fastify.register(fastifyCookie);

    if (env.REDIS_URL) {
      const redisClient = new IORedis({ host: `${env.REDIS_URL}` });

      const abcacheClient = abcache({
        useAwait: true,
        driver: {
          name: 'abstract-cache-redis',
          options: { client: redisClient },
        },
      });

      fastify.register(redis, { client: redisClient });
      fastify.register(caching, { cache: abcacheClient });

      fastify.register(fastifySession, {
        secret,
        store: new RedisStore({
          client: redisClient,
          ttl: 14 * 24 * 60 * 60,
        }),
        cookie: {
          sameSite: 'none',
          secure: true,
        },
      });
    } else {
      const client = new MongoClient(env.MONGO_URI);
      await client.connect();

      const abcacheClient = abcache({
        useAwait: true,
        driver: {
          name: `abstract-cache-mongo`,
          options: { client, dbName: null },
        },
      });

      fastify.register(caching, { cache: abcacheClient });

      fastify.register(fastifySession, {
        secret,
        store: MongoStore.create({
          mongoUrl: env.MONGO_URI,
          ttl: 14 * 24 * 60 * 60,
          autoRemove: `native`,
        }),
        cookie: {
          sameSite: 'none',
          secure: true,
        },
      });
    }

    fastify.register(v1, { prefix: `v1` });
    run();
  } catch (error) {
    reportError(error, `Error registering middleware`);
    process.exit(1);
  }
}

register();

export {};
