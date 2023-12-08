import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { SAMLResponsePayload } from '@boxyhq/saml-jackson';
import { oauthController } from '../../utils/sso';
import { reportError } from '../../utils/logger';
import { sendError } from '../../utils/req_handler';

async function handler(
  req: FastifyRequest<{ Body: SAMLResponsePayload }>,
  res: FastifyReply,
) {
  try {
    const { SAMLResponse, RelayState } = req.body;

    const body = {
      SAMLResponse,
      RelayState,
    };

    const { redirect_url: redirectUrl } =
      await oauthController.samlResponse(body);

    if (!redirectUrl) {
      throw new Error(`Null redirect url.`);
    }
    return res.redirect(redirectUrl);
  } catch (error) {
    reportError(error, `SSO acs error`);
    return sendError(res);
  } finally {
    await req.session.get(`session`)?.end();
  }
}

const acs: RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  { Body: SAMLResponsePayload }
> = {
  method: `POST`,
  url: `/acs`,
  handler,
};

export { acs };
