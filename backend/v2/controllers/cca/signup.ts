import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server as HttpServer, ServerResponse } from 'http';
import { FromSchema } from 'json-schema-to-ts';
import { sendError, sendStatus } from '../../utils/req_handler';
import { reportError, logEvent } from '../../utils/logger';
import { auth } from '../../utils/auth';
import { Cca, iCca } from '../../models/cca';
import { CcaInfo, iCcaInfo } from '../../models/ccaInfo';
import { CcaSignup } from '../../models/ccaSignup';
import { Server } from '../../models/server';

const schema = {
  body: {
    type: `object`,
    required: [`info`, `ccas`],
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
    },
    additionalProperties: false,
  },
} as const;

type iSchema = FromSchema<typeof schema.body>;
type iBody = Omit<iSchema, keyof { info: iCcaInfo; ccas: iCca[] }> & {
  info: iCcaInfo;
  ccas: iCca[];
};

async function handler(
  req: FastifyRequest<{ Body: iBody }>,
  res: FastifyReply,
) {
  const session = req.session.get(`session`)!;
  try {
    const isOpen = (
      await Server.findOne({ key: `ccaOpen` }).session(session.session)
    )?.value;

    if (!isOpen) {
      return await sendStatus(res, 403, `CCA registration not open.`);
    }

    const user = req.session.get(`user`)!;
    const ccas = await Cca.find({
      _id: { $in: req.body.ccas.map((s) => s._id) },
    }).session(session.session);
    const info = {
      user: user._id,
      ...req.body.info,
    };

    if (ccas.length !== req.body.ccas.length) {
      return await sendStatus(res, 400, `Invalid CCA id(s).`);
    }

    const newCcas = ccas.map((c) => ({ user: user._id, cca: c._id }));

    await CcaSignup.deleteMany({ user: user._id }).session(session.session);
    await CcaInfo.deleteOne({ user: user._id }).session(session.session);

    await CcaSignup.create(newCcas, { session: session.session });
    await CcaInfo.create([info], { session: session.session });

    await logEvent(
      `USER SIGNUP CCA`,
      session,
      JSON.stringify({ ccas: newCcas, info }),
      user._id,
    );

    try {
      await session.commit();
    } catch (error) {
      reportError(error, `CCA signup transaction commit error.`);
      await session.abort();
      return await sendStatus(res, 429, `Try again in a few moments`);
    }

    return await sendStatus(res, 200, `CCA signup saved.`);
  } catch (error) {
    reportError(error, `CCA signup handler error`);
    return sendError(res);
  } finally {
    await session.end();
  }
}

const signup: RouteOptions<
  HttpServer,
  IncomingMessage,
  ServerResponse,
  { Body: iBody }
> = {
  method: `POST`,
  url: `/signup`,
  schema,
  preHandler: auth,
  handler,
};

export { signup };
