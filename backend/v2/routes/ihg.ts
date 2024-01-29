import { FastifyInstance } from 'fastify';
import { matches } from '../controllers/ihg/matches';
import { points } from '../controllers/ihg/points';
import { sports } from '../controllers/ihg/sports';

export default async (fastify: FastifyInstance) => {
  fastify.route(matches);
  fastify.route(points);
  fastify.route(sports);
};
