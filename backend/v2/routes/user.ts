import { FastifyInstance } from 'fastify';
import { login } from '../controllers/user/login';
import { info } from '../controllers/user/info';
import { passwordReset } from '../controllers/user/password-reset';

export default async (fastify: FastifyInstance) => {
  fastify.route(login);
  fastify.route(info);
  fastify.route(passwordReset);
};
