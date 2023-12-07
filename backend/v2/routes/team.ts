import { FastifyInstance } from 'fastify';
import { info } from '../controllers/team/info';

export default async (fastify: FastifyInstance) => {
  fastify.route(info);
};
