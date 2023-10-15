const CSV_FILE_PATH = `../csv_files`;

const { User } = require(`../models/user`);
const { Server } = require(`../models/server`);
const mongoose = require(`mongoose`);
const csv = require(`csv-parser`);
const readline = require(`readline`);
const fs = require(`fs`);
const nodemailer = require(`nodemailer`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function send(mails) {
  rl.question(
    `Found ${mails.length} documents containing user and password. Send? (y/n)`,
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
        mails.map(async ({ username, password, email }) => {
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
                                        <h2 style="margin-bottom: 30px; color: #333;">Welcome to Eusoff Jersey Bidding!</h2>
                                        <p style="margin-bottom: 20px; color: #666; line-height: 1.6;">Here are your account details for the bidding:</p>
                                        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin-bottom: 30px;">
                                            <p style="margin: 0; color: #666; line-height: 1.6;"><strong>Username:</strong> ${username}</p>
                                            <p style="margin: 0; color: #666; line-height: 1.6;"><strong>Password:</strong> ${password}</p>
                                        </div>
                                        <p style="margin-bottom: 20px; color: #666; line-height: 1.6;">Stay tuned for further updates regarding your bidding round.</p>
                                        <p style="margin-bottom: 30px; color: #666; line-height: 1.6;">
                                            <a href="${process.env.WEB_URL}" style="background-color: #333; color: #f7f7f7; padding: 10px 15px; border-radius: 5px; text-decoration: none;">Visit the Website</a>
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

          console.log(`Sending email to: ${username}`);
          const info = await transport.sendMail({
            from: process.env.EMAIL, // sender address
            to: email, // list of receivers
            subject: 'Credentials for Jersey Bidding.', // Subject line
            // text: mail.password, // plain text body
            html: template, // html body
          });
        }),
      );
      console.log(`Finished sending all emails.`);
    },
  );
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const mails = [];
  const stream = rl.question(`input password file: `, async (file) => {
    fs.createReadStream(`${CSV_FILE_PATH}/${file}`)
      .on('error', (err) => {
        console.error('Error reading the CSV file:', err);
      })
      .pipe(csv())
      .on('data', ({ email, password, username, ...data }) => {
        mails.push({ email, password, username });
        if (!email || !password || !username) {
          console.error(`Error with user: ${data}`);
        }
      })
      .on(`end`, () => {
        send(mails);
      });
  });
}
run();
