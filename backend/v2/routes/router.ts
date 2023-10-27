import { FastifyInstance } from 'fastify';

const UTILS_PATH = `../utils`;
const { success } = require(`${UTILS_PATH}/req_handler`);

export default async (fastify: FastifyInstance) => {
  fastify.get(`/`, async (req, res) => {
    success(res, `You have reached v2 backend!`);
  });
};
