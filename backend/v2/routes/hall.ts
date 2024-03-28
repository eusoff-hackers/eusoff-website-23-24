import { FastifyInstance } from 'fastify';
import { list } from '../controllers/hall/list';

export default async (fastify: FastifyInstance) => {
  fastify.route(list);
};
