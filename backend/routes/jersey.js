const CONTROLLERS = `../controllers/jersey`;

const eligible = require(`${CONTROLLERS}/eligible`);

module.exports = async (fastify) => {
  fastify.route(eligible);
};
