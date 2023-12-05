const paths = [`./user`, `./bid`, `./jersey`, `./team`];

/* eslint-disable global-require */
const schemas = paths.map((path) => require(path).returnSchema);

async function addSchemas(fastify) {
  await Promise.allSettled([
    schemas.map((schema) => fastify.addSchema(schema)),
  ]);
}

module.exports = { addSchemas };
