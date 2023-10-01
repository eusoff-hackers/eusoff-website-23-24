const CONTROLLERS = `../controllers/user`;

const login = require(`${CONTROLLERS}/login`);
const info = require(`${CONTROLLERS}/info`);

module.exports = async (fastify) => {
  fastify.route(login);
  fastify.route(info);
};
