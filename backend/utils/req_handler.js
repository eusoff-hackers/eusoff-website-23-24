const { logger } = require(`./logger`);

async function success(res, data) {
  await res.send({
    success: true,
    data,
  });
  logger.info(`Success response.`, { res, data });
}

async function error(res, data) {
  await res.send({
    success: false,
    data,
  });
  logger.info(`Error response.`, { res, data });
}

async function sendStatus(res, status, msg) {
  await res.status(status).send(msg);
  logger.info(`${status} status sent.`, { res, status, msg });
}

function resBuilder(obj) {
  return {
    type: `object`,
    properties: {
      success: { type: `boolean` },
      data: obj,
      cached_at: { type: `number` },
    },
    additionalProperties: false,
  };
}

module.exports = { success, error, sendStatus, resBuilder };
