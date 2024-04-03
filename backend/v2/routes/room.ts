import { FastifyInstance } from 'fastify';
import { list } from '../controllers/room/list';
import { info } from '../controllers/room/info';

export default async (fastify: FastifyInstance) => {
  fastify.route(list);
  fastify.route(info);
};
