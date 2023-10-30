import { FastifyInstance } from 'fastify';

/* eslint-disable global-require */
import { rUser } from './user';
import { rTeam } from './team';

async function addSchemas(fastify: FastifyInstance) {
  await fastify.addSchema(rUser);
  await fastify.addSchema(rTeam);
}

export { addSchemas };
