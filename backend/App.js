const { env } = process;
const LOG_LEVEL = env.NODE_ENV !== 'production';

const Fastify = require(`fastify`);
const mongoose = require(`mongoose`);
const { logger } = require(`./utils/logger`);

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
    logger.error(`Error starting server: ${error.message}`, { error });
    process.exit(1);
  }
}

run();
