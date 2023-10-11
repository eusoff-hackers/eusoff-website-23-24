const UTILS = `.`;

const { env } = process;
const { logger } = require(`${UTILS}/logger`);

async function checkCache(req, res) {
  try {
    const cache = await req.fastify.cache.get(req.url);
    if (cache) {
      logger.info(`Replying from cache for ${req.url}.`);
      res.fromCache = true;
      return res.send(cache.item);
    }
  } catch (error) {
    logger.error(`Error checking cache: ${error.message}`, { error });
  }
  return null;
}

async function setCache(req, res, payload) {
  if (res.fromCache) return payload;

  const data = JSON.parse(payload);
  try {
    logger.info(`Setting cache for ${req.url}.`);
    data.cached_at = Date.now();

    await req.fastify.cache.set(req.url, data, env.CACHE_TIME);
  } catch (error) {
    logger.error(`Error setting cache for ${req.url}.`, { error });
  }
  return JSON.stringify(data);
}

module.exports = { checkCache, setCache };
