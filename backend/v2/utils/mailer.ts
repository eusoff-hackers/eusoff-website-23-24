import nodemailer from 'nodemailer';
import { Types } from 'mongoose';
import { logEvent, logger, reportError } from './logger';
import { MongoSession } from './mongoSession';

const { ENABLE_EMAIL, EMAIL, EMAIL_PASSWORD } = process.env;
const MAIL_FLAG =
  Boolean(ENABLE_EMAIL === 'true') && Boolean(EMAIL) && Boolean(EMAIL_PASSWORD);

const transport = nodemailer.createTransport({
  service: 'Outlook365',
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

interface Payload {
  subject: string;
  title: string;
  body: string[];
  email: string;
  username: string;
  userId: Types.ObjectId;
}

async function mail(payload: Payload, session: MongoSession) {
  try {
    logger.info(`Emailing user: ${payload.username}.`);
    if (!MAIL_FLAG) return false;

    const { subject, title, body, email, username, userId } = payload;

    const template = `<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Details</title>
      </head>
      
      <body style="font-family: 'Roboto', Arial, sans-serif; margin: 0; padding: 0; background-color: #f7f7f7; color: #333;">
      
          <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f7f7f7">
              <tr>
                  <td align="center" valign="top" style="padding: 5% 10px;">
                      <table width="600" border="0" cellspacing="0" cellpadding="20" bgcolor="#ffffff" style="border-radius: 8px; box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);">
                          <tr>
                              <td>
                                  <h2 style="margin-bottom: 30px; color: #333;">${title}</h2>
                                  <p style="margin-bottom: 20px; color: #666; line-height: 1.6;">
                                    Dear ${username},
                                  </p>
                                  
                                  ${body.reduce(
                                    (a, b) =>
                                      `${a 
                                      }\n<p style="margin-bottom: 20px; color: #666; line-height: 1.6; align-text: justify;">
                                                    ${b}
                                                    </p>`,
                                    '',
                                  )}

                                  <p style="margin-bottom: 30px; color: #666; line-height: 1.6;">
                                      <a href="https://eusoff.college/" style="background-color: #333; color: #f7f7f7; padding: 10px 15px; border-radius: 5px; text-decoration: none;">Visit the Website</a>
                                  </p>
                                  <p style="margin-bottom: 30px; color: #aaa; line-height: 1.6;">If you are not the intended recipient of this email, please reply to this email immediately.</p>
                                  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
                                  <p style="margin-bottom: 0; color: #aaa; line-height: 1.6;">Happy Bidding,<br>Eusoff Hackers</p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      
      </body>
      
      </html>`;

    await transport.sendMail({
      from: EMAIL,
      to: email,
      subject,
      html: template,
    });

    await logEvent(`MAILED USER`, session, JSON.stringify(payload), userId);
    return true;
  } catch (error) {
    reportError(error, `Mailer error`);
    throw error;
  }
}

export { mail };
