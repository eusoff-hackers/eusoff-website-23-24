const user = require(`./user`);

module.exports = async (fastify) => {
  await fastify.get(`/`, async (req, res) => {
    res.send({ success: true, data: `You have reached the backend!` });
  });

  fastify.register(user, { prefix: `/user` });
};
