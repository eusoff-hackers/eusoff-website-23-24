import { FastifyInstance } from 'fastify';
import { authorize } from '../controllers/sso/authorize';
import { acs } from '../controllers/sso/acs';
import { callback } from '../controllers/sso/callback';

export default async (fastify: FastifyInstance) => {
  fastify.route(authorize);
  fastify.route(acs);
  fastify.route(callback);
};
