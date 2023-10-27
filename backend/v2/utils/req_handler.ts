import { FastifyReply } from 'fastify';

const { logger } = require(`./logger`);

async function success<Type>(res: FastifyReply, data: Type) {
  await res.send({
    success: true,
    data,
  });
  logger.info(`Success response.`, { data });
}

async function error<Type>(res: FastifyReply, data: Type) {
  await res.send({
    success: false,
    data,
  });
  logger.error(`Error response.`, { data });
}

async function sendStatus(res: FastifyReply, status: number, msg: string) {
  await res.status(status).send(msg);
  logger.info(`${status} status sent.`, { status, msg });
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

export { success, error, sendStatus, resBuilder };
