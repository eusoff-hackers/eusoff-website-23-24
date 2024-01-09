import { FastifyInstance } from 'fastify';
import { list } from '../controllers/cca/list';

export default async (fastify: FastifyInstance) => {
  fastify.route(list);
};
