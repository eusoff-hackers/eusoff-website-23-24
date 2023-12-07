import { FastifyInstance } from 'fastify';
import { info } from '../controllers/bid/info';
import { create } from '../controllers/bid/create';

export default async (fastify: FastifyInstance) => {
  fastify.route(info);
  fastify.route(create);
};
