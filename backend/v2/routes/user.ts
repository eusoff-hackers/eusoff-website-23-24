import { FastifyInstance } from 'fastify';

const CONTROLLERS = `../controllers/user`;
const { login } = require(`${CONTROLLERS}/login`);

export default async (fastify: FastifyInstance) => {
  fastify.route(login);
  
};
