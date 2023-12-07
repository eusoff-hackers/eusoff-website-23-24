const CONTROLLERS = `../controllers/jersey`;

const eligible = require(`${CONTROLLERS}/eligible`);
const info = require(`${CONTROLLERS}/info`);

module.exports = async (fastify) => {
  fastify.decorateRequest(`fastify`, fastify);

  fastify.route(eligible);
  fastify.route(info);
};
