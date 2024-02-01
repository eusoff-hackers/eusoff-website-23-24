import { FastifyInstance } from 'fastify';
import { matches } from '../controllers/ihg/matches';
import { points } from '../controllers/ihg/points';
import { sports } from '../controllers/ihg/sports';
import { placements } from '../controllers/ihg/placements';
import admin from './ihg/admin';

export default async (fastify: FastifyInstance) => {
  fastify.decorateRequest(`fastify`, fastify);
  fastify.route(matches);
  fastify.route(points);
  fastify.route(sports);
  fastify.route(placements);

  fastify.register(admin, { prefix: `/admin` });
};
