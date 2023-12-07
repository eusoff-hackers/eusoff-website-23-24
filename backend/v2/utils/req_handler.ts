import { FastifyReply } from 'fastify';
import { logger } from './logger';

async function success<Type>(res: FastifyReply, data: Type) {
  logger.info(`Success response.`);
  return res.send({
    success: true,
    data,
  });
}

async function sendStatus(res: FastifyReply, status: number, msg: string) {
  logger.info(`${status} status sent.`, { status, msg });
  return res.status(status).send(msg);
}

async function sendError(res: FastifyReply) {
  logger.error(`Error response.`);
  return sendStatus(res, 500, `Internal Server Error.`);
}

function resBuilder<Type>(obj: Type) {
  return {
    type: `object`,
    properties: {
      success: { type: `boolean` },
      data: obj,
      cached_at: { type: `number` },
    },
    additionalProperties: false,
  };
}

export { success, sendError, sendStatus, resBuilder };
