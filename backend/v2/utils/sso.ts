import { controllers, IOAuthController } from '@boxyhq/saml-jackson';
import * as fs from 'fs';
import { reportError, logger } from './logger';

/* eslint-disable import/no-mutable-exports */
let apiController;
let oauthController: IOAuthController;

const jacksonOptions = {
  externalUrl: process.env.BACKEND_URL,
  samlAudience: process.env.SSO_AUDIENCE,
  samlPath: '/sso/acs',
  db: {
    engine: 'mongo' as const,
    url: process.env.MONGO_URI,
  },
  ory: {
    projectId: undefined,
    sdkToken: undefined,
  },
};

(async function init() {
  try {
    const jackson = await controllers(jacksonOptions);

    apiController = jackson.apiController;
    oauthController = jackson.oauthController;

    const metadata = fs.readFileSync(`./sso/FederationMetadata.xml`, `utf8`);
    const defaultRedirectUrl = `${process.env.BACKEND_URL}/sso/callback`;
    const redirectUrl = `["${process.env.BACKEND_URL}/*"]`;

    await apiController.config({
      rawMetadata: metadata,
      tenant: process.env.SSO_TENANT,
      product: process.env.SSO_PRODUCT,
      defaultRedirectUrl,
      redirectUrl,
    });

    logger.info(`SSO initialization success.`);
  } catch (error) {
    reportError(error, `SSO initialization error.`);
  }
})();

export { oauthController, apiController };
