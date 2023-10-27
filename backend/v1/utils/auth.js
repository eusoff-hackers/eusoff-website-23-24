const session = require(`./session`);
const { logger } = require(`./logger`);
const { sendStatus } = require(`./req_handler`);
const { User } = require(`../models/user`);

async function auth(req, res) {
  if (!req.session || !req.session.user) {
    return sendStatus(res, 401);
  }
  const { user: userSession } = req.session;
  const user = await User.findById(userSession._id)
    .populate(`bids`)
    .populate(`teams`);

  req.session.user = user;
  return session.save(req);
}

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

async function logout(req) {
  try {
    await session.regenerate(req);
    return await session.save(req);
  } catch (error) {
    logger.error(`Failed regenerating user session: ${error.message}`);
    throw new Error(`Failed to regenerate session.`);
  }
}

module.exports = { login, auth, logout };
