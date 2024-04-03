import { FastifyInstance } from 'fastify';

/* eslint-disable global-require */
import { rUser } from './user';
import { rTeam } from './team';
import { rBiddingInfo } from './biddingInfo';
import { rBid } from './bid';
import { rJersey } from './jersey';
import { rCca } from './cca';
import { rCcaInfo } from './ccaInfo';
import { rCcaSignup } from './ccaSignup';
import { rHall } from './hall';
import { rIhgMatch } from './ihgMatch';
import { rIhgPoint } from './ihgPoint';
import { rIhgSport } from './ihgSport';
import { rIhgPlacement } from './ihgPlacement';
import { rRoom } from './room';
import { rRoomBidInfo } from './roomBidInfo';

async function addSchemas(fastify: FastifyInstance) {
  await fastify.addSchema(rUser);
  await fastify.addSchema(rTeam);
  await fastify.addSchema(rBiddingInfo);
  await fastify.addSchema(rJersey);
  await fastify.addSchema(rBid);
  await fastify.addSchema(rCca);
  await fastify.addSchema(rCcaInfo);
  await fastify.addSchema(rCcaSignup);
  await fastify.addSchema(rHall);
  await fastify.addSchema(rIhgMatch);
  await fastify.addSchema(rIhgPoint);
  await fastify.addSchema(rIhgSport);
  await fastify.addSchema(rIhgPlacement);
  await fastify.addSchema(rRoom);
  await fastify.addSchema(rRoomBidInfo);
}

export { addSchemas };
