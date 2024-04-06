import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server as HttpServer, ServerResponse } from 'http';
import { success, resBuilder, sendError } from '../../utils/req_handler';
import { logAndThrow, reportError } from '../../utils/logger';
import { auth } from '../../utils/auth';
import { CcaInfo } from '../../models/ccaInfo';
import { CcaSignup } from '../../models/ccaSignup';
import { Server } from '../../models/server';

const schema = {
  response: {
    200: resBuilder({
      type: `object`,
      properties: {
        info: {
          $ref: `ccaInfo`,
        },
        ccas: {
          type: `array`,
          items: {
            $ref: `cca`,
          },
        },
        isOpen: { type: `boolean` },
      },
    }),
  },
} as const;

async function handler(req: FastifyRequest, res: FastifyReply) {
  const session = req.session.get(`session`)!;
  try {
    const user = req.session.get(`user`)!;

    const p = await Promise.allSettled([
      CcaInfo.findOne({ user: user._id }).session(session.session),
      CcaSignup.find({ user: user._id })
        .populate(`cca`)
        .session(session.session),
    ]);
    const info = logAndThrow([p[0]], `Cca info retrieval error`)[0] || {
      name: null,
      telegram: null,
      email: null,
    };
    const ccas = logAndThrow([p[1]], `CcaSignups parse error`)[0].map(
      (c) => c.cca,
    );

    const isOpen = (
      await Server.findOne({ key: `ccaOpen` }).session(session.session)
    )?.value;

    return await success(res, { info, ccas, isOpen });
  } catch (error) {
    reportError(error, `Bid Info handler error`);
    return sendError(res);
  } finally {
    await session.end();
  }
}

const info: RouteOptions<
  HttpServer,
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
