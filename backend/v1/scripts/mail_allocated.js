const env = process.env;

const mongoose = require(`mongoose`);
const { User } = require(`../models/user`);
const { Server } = require(`../models/server`);
const nodemailer = require(`nodemailer`);
const readline = require(`readline`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function findUnallocated() {
  const unallocated = await User.find({
    isEligible: true,
  });
  rl.question(
    `Found ${unallocated.length} unallocated users. Send them emails? (y/n)`,
    async (ans) => {
      if (ans !== `y`) return;
      var transport = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      await Promise.allSettled(
        unallocated.map(async ({ username, email }) => {
          const template = `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bidding Outcome</title>
            </head>
            
            <body style="font-family: 'Roboto', Arial, sans-serif; margin: 0; padding: 0; background-color: #f7f7f7; color: #333;">
            
                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f7f7f7">
                    <tr>
                        <td align="center" valign="top" style="padding: 5% 10px;">
                            <table width="600" border="0" cellspacing="0" cellpadding="20" bgcolor="#ffffff" style="border-radius: 8px; box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);">
                                <tr>
                                    <td>
                                        <h2 style="margin-bottom: 30px; color: #E74C3C;">Unsuccessful Bidding Outcome</h2>
                                        <p style="margin-bottom: 20px; color: #666; line-height: 1.6;">Thank you for participating in the Eusoff Jersey Bidding. Unfortunately, you were not allocated a number this time.</p>
                                      
                                        <p style="margin-bottom: 30px; color: #666; line-height: 1.6;">While this is disappointing, we encourage you to try again in the next bidding round. Your interest and participation mean a lot to us, and there's always another opportunity to secure your preferred number!</p>
                                        
                                        <p style="margin-bottom: 30px; color: #aaa; line-height: 1.6;">If you have any questions or need further assistance, please do not hesitate to contact us.</p>
                                        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
                                        <p style="margin-bottom: 0; color: #aaa; line-height: 1.6;">Happy Bidding,<br>Eusoff Team</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            
            </body>
            
            </html>`;
          console.log(`Emailing ${username} at ${email}.`);
          const info = await transport.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: `Jersey number results are out!`,
            html: template,
          });
        }),
      );
      console.log(`Finished sending all emails to unallocated users.`);
    },
  );
}

async function run() {
  console.log(process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection;
  console.log(await User.find({}));
  console.log(`Connected Atlas.`);
  const current_round = (await Server.findOne({ key: `round` })).value;
  const allocated = await User.find({
    $and: [
      { $or: [{ bidding_round: 5 }, { bidding_round: current_round }] },
      { isEligible: false },
    ],
  });

  rl.question(
    `Found ${allocated.length} allocated users. Email them their number? (y/n) `,
    async (ans) => {
      if (ans !== `y`) {
        findUnallocated();
        return;
      }

      var transport = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      await Promise.allSettled(
        allocated.map(async ({ username, allocatedNumber, email }) => {
          console.log(username);
          const template = `<!DOCTYPE html>
          <html lang="en">
          
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Bidding Outcome</title>
          </head>
          
          <body style="font-family: 'Roboto', Arial, sans-serif; margin: 0; padding: 0; background-color: #f7f7f7; color: #333;">
          
              <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f7f7f7">
                  <tr>
                      <td align="center" valign="top" style="padding: 5% 10px;">
                          <table width="600" border="0" cellspacing="0" cellpadding="20" bgcolor="#ffffff" style="border-radius: 8px; box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);">
                              <tr>
                                  <td>
                                      <h2 style="margin-bottom: 30px; color: #333;">Your Bidding Outcome</h2>
                                      <p style="margin-bottom: 20px; color: #666; line-height: 1.6;">Thank you for participating in the Eusoff Jersey Bidding. Here is the outcome of your bid:</p>
                                      <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin-bottom: 30px;">
                                          <p style="margin: 0; color: #666; line-height: 1.6; font-size: 18px;"><strong>Allocated Number:</strong> ${allocatedNumber}</p>
                                      </div>
                                      <p style="margin-bottom: 30px; color: #666; line-height: 1.6;">We appreciate your participation and encourage you to stay tuned for future biddings and announcements!</p>
                                      <p style="margin-bottom: 30px; color: #666; line-height: 1.6;">
                                      </p>
                                      <p style="margin-bottom: 30px; color: #aaa; line-height: 1.6;">If you have any questions or need further assistance, please do not hesitate to contact us.</p>
                                      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
                                      <p style="margin-bottom: 0; color: #aaa; line-height: 1.6;">Happy Bidding,<br>Eusoff Team</p>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
          
          </body>
          
          </html>`;

          console.log(
            `Emailing ${username} at ${email} for number ${allocatedNumber}.`,
          );

          const info = await transport.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: `Jersey number results are out!`,
            html: template,
          });
        }),
      );
      console.log(`Finished sending all emails to allocated users.`);

      findUnallocated();
    },
  );
}
run();
