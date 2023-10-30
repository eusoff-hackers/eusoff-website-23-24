import { FastifyInstance } from 'fastify';
import { success } from '../utils/req_handler';
import { addSchemas } from '../models/fastify-schemas';
import user from './user';

export default async (fastify: FastifyInstance) => {
  await addSchemas(fastify);

  fastify.get(`/`, async (req, res) => {
    success(res, `You have reached v2 backend!`);
  });
  fastify.register(user, { prefix: `/user` });
};
