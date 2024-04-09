import { FastifyInstance } from 'fastify';
import { list } from '../controllers/room/list';
import { info } from '../controllers/room/info';
import { bid } from '../controllers/room/bid';

export default async (fastify: FastifyInstance) => {
  fastify.route(list);
  fastify.route(info);
  fastify.route(bid);
};
