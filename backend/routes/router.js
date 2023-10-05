const user = require(`./user`);
const bid = require(`./bid`);
const jersey = require(`./jersey`);
const { addSchemas } = require(`../models/fastify-schemas`);

module.exports = async (fastify) => {
  await addSchemas(fastify);

  fastify.get(`/`, async (req, res) => {
    res.send({ success: true, data: `You have reached the backend!` });
  });

  fastify.register(user, { prefix: `/user` });
  fastify.register(bid, { prefix: `/bid` });
  fastify.register(jersey, { prefix: `/jersey` });
};
