import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { FromSchema } from 'json-schema-to-ts';
import { isEligible } from '../../utils/jersey';
import { reportError, logEvent } from '../../utils/logger';
import { sendError, sendStatus } from '../../utils/req_handler';
import { auth } from '../../utils/auth';
import { Jersey, iJersey } from '../../models/jersey';
import { Bid } from '../../models/bid';

const schema = {
  body: {
    type: `object`,
    required: [`bids`],
    properties: {
      bids: {
        type: `array`,
        maxItems: 5,
        uniqueItems: true,
        items: {
          $ref: `jersey`,
        },
      },
    },
    additionalProperties: false,
  },
} as const;

type iBids = FromSchema<typeof schema.body>;
type iBody = Omit<iBids, keyof { bids: iJersey[] }> & { bids: iJersey[] };

async function handler(
  req: FastifyRequest<{ Body: iBody }>,
  res: FastifyReply,
) {
  const session = req.session.get(`session`)!;
  try {
    const user = req.session.get(`user`)!;
    const jerseys = await Jersey.find({
      number: { $in: req.body.bids.map((j) => j.number) },
    });
    if (!(await isEligible(user, jerseys, session))) {
      return await sendStatus(res, 400, `Ineligible to bid requested numbers.`);
    }

    const newBids = jerseys.map((jersey, index) => ({
      user: user._id,
      jersey: jersey._id,
      priority: index,
    }));

    await Bid.deleteMany({ user: user._id }).session(session.session);
    await Bid.create(newBids, { session: session.session });

    await logEvent(
      `USER PLACE BIDS`,
      session,
      JSON.stringify(newBids),
      user._id,
    );

    try {
      await session.commit();
    } catch (error) {
      reportError(error, `Bid create transaction commit error.`);
      await session.abort();
      return await sendStatus(res, 429, `Try again in a few moments`);
    }

    return await sendStatus(res, 200, `Bid saved.`);
  } catch (error) {
    reportError(error, `Bid Creation handler error`);
    return sendError(res);
  } finally {
    await session.end();
  }
}

const create: RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  { Body: iBody }
> = {
  method: `POST`,
  url: `/create`,
  schema,
  preHandler: auth,
  handler,
};

export { create };
