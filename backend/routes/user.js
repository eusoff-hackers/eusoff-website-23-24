const CONTROLLERS = `../controllers/user`;

const login = require(`${CONTROLLERS}/login`);

module.exports = async (fastify) => {
  fastify.route(login);
};
