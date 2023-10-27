import { FastifyInstance } from 'fastify';

const UTILS_PATH = `../utils`;

const { logAndThrow } = require(`${UTILS_PATH}/logger`);
/* eslint-disable global-require */
const schemas = [require(`./user`).rUser, require(`./team`).rTeam];

async function addSchemas(fastify: FastifyInstance) {
  logAndThrow(
    await Promise.allSettled([
      schemas.map((schema) => fastify.addSchema(schema)),
    ]),
    `Failed loading schemas`,
  );
}

export { addSchemas };
