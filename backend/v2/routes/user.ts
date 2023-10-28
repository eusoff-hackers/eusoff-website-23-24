import { FastifyInstance } from 'fastify';

const CONTROLLERS = `../controllers/user`;
const { login } = require(`${CONTROLLERS}/login`);
const { info } = require(`${CONTROLLERS}/info`);

export default async (fastify: FastifyInstance) => {
  fastify.route(login);
  fastify.route(info);
  
};
