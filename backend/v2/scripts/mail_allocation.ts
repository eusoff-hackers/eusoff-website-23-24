/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import mongoose from 'mongoose';
import readline from 'readline';
import nodemailer from 'nodemailer';
import { iUser } from '../models/user';
import { iRoom } from '../models/room';
import { RoomBidInfo , iRoomBidInfo } from '../models/roomBidInfo';

const transport = nodemailer.createTransport({
  // host: 'smtpout.secureserver.net',
  // port: 465,
  // secure: true,
  service: 'Outlook365',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function mail(info: iRoomBidInfo) {
  try {
    const { username, email } = info.user as iUser;
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
                                <h2 style="margin-bottom: 30px; color: #333;">You have been successfully allocated a room!</h2>
                                <p style="margin-bottom: 20px; color: #666; line-height: 1.6;"> We are happy to inform you that you've been allocated a room. Your new allocated room is:</p>
                                <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin-bottom: 30px;">
                                    <p style="margin: 0; color: #666; line-height: 1.6;"> <strong>${
                                      (info.room as iRoom).block
                                    }${(info.room as iRoom).number}</strong></p>
                                </div>
                                <p style="margin-bottom: 30px; color: #666; line-height: 1.6;">
                                    <a href="https://eusoff.college/" style="background-color: #333; color: #f7f7f7; padding: 10px 15px; border-radius: 5px; text-decoration: none;">Visit the Website</a>
                                </p>

                                <p style="margin-bottom: 20px; color: #666; line-height: 1.6;">Thank you for participating in Room bidding. We apologize for any inconvenience you may have encountered. Looking forward to seeing you again soon!</p>
                                
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
    await transport.sendMail({
      from: process.env.EMAIL, // sender address
      to: email, // list of receivers
      subject: 'Congratulations on Your Room Allocation', // Subject line
      // text: mail.password, // plain text body
      html: template, // html body
    });
    console.log(`Email to ${username} sent.`);
  } catch (error) {
    console.error(`Mailing error `, error);
  }
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const users = await RoomBidInfo.find({ isAllocated: true })
    .populate(`user`)
    .populate(`room`);

  mail(users.filter((u) => (u.user as iUser).username === 'A0276140L')[0]);
  const answer = await new Promise((resolve) => {
    rl.question(`Found ${users.length} allocations. Send? (y/n) `, resolve);
  });

  if (answer !== `y`) return;

  for (const user of users) {
    await mail(user);
  }
  console.log(`finished`);
})();
