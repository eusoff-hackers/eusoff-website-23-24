import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { FromSchema } from 'json-schema-to-ts';
import bcrypt from 'bcryptjs';
import { sendError, sendStatus } from '../../utils/req_handler';
import { User } from '../../models/user';
import { reportError } from '../../utils/logger';
import { auth } from '../../utils/auth';

const schema = {
  body: {
    type: `object`,
    required: [`credentials`],
    properties: {
      credentials: {
        type: `object`,
        additionalProperties: false,
        required: [`password`],
        properties: {
          password: { type: `string` },
        },
      },
    },
  },
} as const;

type iBody = FromSchema<typeof schema.body>;

async function handler(
  req: FastifyRequest<{ Body: iBody }>,
  res: FastifyReply,
) {
  const session = req.session.get(`session`)!;
  try {
    const {
      credentials: { password },
    } = req.body;

    const user = req.session.get(`user`)!;

    await User.findOneAndUpdate(
      { _id: user._id },
      { password: await bcrypt.hash(password, 10) },
    ).session(session.session);

    try {
      await session.commit();
    } catch (error) {
      await session.abort();
      return await sendStatus(
        res,
        429,
        `Please wait for a while before making another request.`,
      );
    }

    return await sendStatus(res, 200, `Saved!`);
  } catch (error) {
    reportError(error, `Password Reset handler error.`);
    return sendError(res);
  } finally {
    await session.end();
  }
}

const passwordReset: RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  { Body: iBody }
> = {
  method: `POST`,
  url: `/password-reset`,
  schema,
  preHandler: auth,
  handler,
};

export { passwordReset };
