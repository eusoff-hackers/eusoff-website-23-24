import { FastifyInstance } from 'fastify';
import { list } from '../controllers/room/list';

export default async (fastify: FastifyInstance) => {
  fastify.route(list);
};
