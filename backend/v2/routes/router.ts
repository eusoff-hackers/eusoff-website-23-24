import { FastifyInstance } from 'fastify';
import { success } from '../utils/req_handler';
import { addSchemas } from '../models/fastify-schemas';
import { addSession } from '../utils/mongoSession';
import user from './user';
import team from './team';
import bid from './bid';
import jersey from './jersey';
import sso from './sso';
import cca from './cca';
import hall from './hall';
import ihg from './ihg';
import room from './room';

export default async (fastify: FastifyInstance) => {
  await addSchemas(fastify);
  await addSession(fastify);

  fastify.get(`/`, async (req, res) => {
    success(res, `You have reached v2 backend!`);
  });
  fastify.register(user, { prefix: `/user` });
  fastify.register(team, { prefix: `/team` });
  fastify.register(bid, { prefix: `/bid` });
  fastify.register(jersey, { prefix: `/jersey` });
  fastify.register(sso, { prefix: `/sso` });
  fastify.register(cca, { prefix: `/cca` });
  fastify.register(hall, { prefix: `/hall` });
  fastify.register(ihg, { prefix: `/ihg` });
  fastify.register(room, { prefix: `/room` });
};
