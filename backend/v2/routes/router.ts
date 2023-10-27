import { FastifyInstance } from 'fastify';

const UTILS_PATH = `../utils`;
const { success } = require(`${UTILS_PATH}/req_handler`);
const { addSchemas } = require(`../models/fastify-schemas`);
const user = require(`./user`);

export default async (fastify: FastifyInstance) => {
  await addSchemas(fastify);

  fastify.get(`/`, async (req, res) => {
    success(res, `You have reached v2 backend!`);
  });
  fastify.register(user, { prefix: `/user` });
  
};
