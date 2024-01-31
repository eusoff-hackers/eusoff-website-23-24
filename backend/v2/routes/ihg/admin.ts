import { FastifyInstance } from 'fastify';
import { placements } from '../../controllers/ihg/admin/placements';

export default async (fastify: FastifyInstance) => {
  fastify.route(placements);
};
