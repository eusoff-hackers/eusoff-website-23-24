import { FastifyInstance } from 'fastify';
import { matches } from '../controllers/ihg/matches';

export default async (fastify: FastifyInstance) => {
  fastify.route(matches);
};
