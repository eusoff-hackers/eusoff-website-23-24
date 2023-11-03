import { FastifyInstance } from 'fastify';
import { info } from '../controllers/bid/info';

export default async (fastify: FastifyInstance) => {
  fastify.route(info);
};
