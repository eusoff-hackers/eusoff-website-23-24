import { FastifyInstance } from 'fastify';
import { eligible } from '../controllers/jersey/eligible';
import { info } from '../controllers/jersey/info';

export default async (fastify: FastifyInstance) => {
  fastify.decorateRequest(`fastify`, fastify);
  fastify.route(eligible);
  fastify.route(info);
};
