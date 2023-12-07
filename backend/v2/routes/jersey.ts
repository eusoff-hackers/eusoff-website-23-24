import { FastifyInstance } from 'fastify';
import { eligible } from '../controllers/jersey/eligible';

export default async (fastify: FastifyInstance) => {
  fastify.route(eligible);
};
