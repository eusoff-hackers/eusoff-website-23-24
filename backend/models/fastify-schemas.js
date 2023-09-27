const { userReturnSchema } = require(`./user`);

async function addSchemas(fastify) {
  await Promise.allSettled([fastify.addSchema(userReturnSchema)]);
}

module.exports = { addSchemas };
