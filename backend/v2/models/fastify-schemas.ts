import { FastifyInstance } from 'fastify';

/* eslint-disable global-require */
import { rUser } from './user';
import { rTeam } from './team';
import { rBiddingInfo } from './biddingInfo';
import { rBid } from './bid';
import { rJersey } from './jersey';
import { rCca } from './cca';

async function addSchemas(fastify: FastifyInstance) {
  await fastify.addSchema(rUser);
  await fastify.addSchema(rTeam);
  await fastify.addSchema(rBiddingInfo);
  await fastify.addSchema(rJersey);
  await fastify.addSchema(rBid);
  await fastify.addSchema(rCca);
}

export { addSchemas };
