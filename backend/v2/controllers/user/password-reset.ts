import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { FromSchema } from 'json-schema-to-ts';
import bcrypt from 'bcryptjs';
import { sendStatus } from '../../utils/req_handler';
import { MongoSession } from '../../utils/mongoSession';
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
  try {
    const session = new MongoSession();
    await session.start();
    try {
      const {
        credentials: { password },
      } = req.body;
      const { user: unsafeUser } = req.session;
      await User.findOneAndUpdate(
        { _id: unsafeUser._id },
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
      return sendStatus(res, 500, `Internal Server Error.`);
    } finally {
      await session.end();
    }
  } catch (error) {
    reportError(error, `Password Reset handler session serror`);
    return sendStatus(res, 500, `Internal Server Error.`);
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
