const session = require(`./session`);
const { logger } = require(`./logger`);

async function login(user, req) {
  try {
    await session.regenerate(req);
    req.session.user = user;
    return await session.save(req);
  } catch (error) {
    logger.error(`Failed setting session on login: ${error.message}`, {
      error,
    });
    throw new Error(`Failed to set session.`);
  }
}

module.exports = { login };
