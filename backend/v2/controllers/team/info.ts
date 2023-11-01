import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { sendStatus, resBuilder, success } from '../../utils/req_handler';
import { MongoSession } from '../../utils/mongoSession';
import { Member } from '../../models/member';
import { reportError } from '../../utils/logger';
import { auth } from '../../utils/auth';

const schema = {
  response: {
    200: resBuilder({
      type: `object`,
      properties: {
        teams: {
          type: `array`,
          items: {
            $ref: `team`,
          },
        },
      },
    }),
  },
} as const;

async function handler(req: FastifyRequest, res: FastifyReply) {
  try {
    const session = new MongoSession();
    await session.start();
    try {
      const { user } = req.session;
      const teams = (
        await Member.find({ user: user._id })
          .lean()
          .populate(`team`)
          .session(session.session)
      ).map((team) => team.team);
      return await success(res, { teams });
    } catch (error) {
      reportError(error, `Team info handler error`);
      return sendStatus(res, 500, `Internal Server Error.`);
    }
  } catch (error) {
    reportError(error, `Team info handler session error`);
    return sendStatus(res, 500, `Internal Server Error.`);
  }
}

const info: RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  Record<string, never>
> = {
  method: `GET`,
  url: `/info`,
  schema,
  preHandler: auth,
  handler,
};

export { info };
