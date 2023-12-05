const CONTROLLERS = `../controllers/user`;

const login = require(`${CONTROLLERS}/login`);
const logout = require(`${CONTROLLERS}/logout`);
const info = require(`${CONTROLLERS}/info`);

module.exports = async (fastify) => {
  fastify.route(login);
  fastify.route(logout);
  fastify.route(info);
};
