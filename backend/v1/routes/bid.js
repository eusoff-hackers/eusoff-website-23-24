const CONTROLLERS = `../controllers/bid`;

const create = require(`${CONTROLLERS}/create`);

module.exports = async (fastify) => {
  fastify.route(create);
};
