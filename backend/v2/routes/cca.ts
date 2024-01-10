import { FastifyInstance } from 'fastify';
import { list } from '../controllers/cca/list';
import { info } from '../controllers/cca/info';
import { signup } from '../controllers/cca/signup';

export default async (fastify: FastifyInstance) => {
  fastify.route(list);
  fastify.route(info);
  fastify.route(signup);
};
