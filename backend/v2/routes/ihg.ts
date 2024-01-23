import { FastifyInstance } from 'fastify';
import { matches } from '../controllers/ihg/matches';
import { points } from '../controllers/ihg/points';

export default async (fastify: FastifyInstance) => {
  fastify.route(matches);
  fastify.route(points);
};
