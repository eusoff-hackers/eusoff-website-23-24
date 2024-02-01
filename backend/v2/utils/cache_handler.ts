import { FastifyRequest, FastifyReply } from 'fastify';
import { logger, reportError } from './logger';

const { env } = process;

async function checkCache<T>(
  req: FastifyRequest,
  res: FastifyReply,
): Promise<void> {
  try {
    if (!req.fastify) return;
    const cache = (await req.fastify.cache.get(req.url)) as unknown as {
      item: T;
    };

    if (cache) {
      logger.info(`Replying from cache for ${req.url}.`);
      res.fromCache = true;
      await res.send(cache.item);
    }
  } catch (error) {
    reportError(error, `Error checking cache for ${req.url}`);
  }
}

async function setCache(
  req: FastifyRequest,
  res: FastifyReply,
  payload: unknown,
) {
  if (!(typeof payload === `string`)) return payload;
  if (res.fromCache) return payload;
  if (!req.fastify) return payload;

  const data = JSON.parse(payload);
  try {
    logger.info(`Setting cache for ${req.url}.`);
    data.cached_at = Date.now();

    await req.fastify.cache.set(req.url, data, parseInt(env.CACHE_TIME, 10));
  } catch (error) {
    reportError(error, `Error setting cache for ${req.url}.`);
  }
  return JSON.stringify(data);
}

export { checkCache, setCache };
