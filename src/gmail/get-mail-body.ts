import { google, gmail_v1 } from "googleapis";
import { DateTime } from "luxon";
import { getOAuthClient } from "./oauth";
import { getUserByEmail } from "../db";
import { convert } from "html-to-text";

const gmail = google.gmail("v1");

export const getLatestMailFromLabel = async (
  labelIds: Array<string>
): Promise<{
  body: string;
  receivedAt: DateTime;
}> => {
  console.log("====================================");
  console.log("labelIds", labelIds);
  console.log("====================================");
  const { oauth2Client } = await getOAuthClient();
  let user = getUserByEmail(process.env.GCP_AUTH_EMAIL);
  oauth2Client.setCredentials(user);

  try {
    const latestMessageId: string = await new Promise((resolve, reject) => {
      gmail.users.messages.list(
        {
          userId: "me",
          auth: oauth2Client,
          maxResults: 10,
          labelIds: labelIds,
        },
        function (err, res) {
          console.log("====================================");
          console.log(1, err);
          console.log(2, res);
          console.log("====================================");
          if (err) {
            reject(err);
          } else {
            const messages = res.data.messages;
            resolve(messages?.[0]?.id);
          }
        }
      );
    });

    if (!latestMessageId) {
      if (!latestMessageId) throw new Error("No mail found under label 'keka'");
    }

    const latestMessageContent: gmail_v1.Schema$MessagePart = await new Promise(
      (resolve, reject) => {
        gmail.users.messages.get(
          {
            userId: "me",
            auth: oauth2Client,
            id: latestMessageId,
          },
          function (err, res) {
            if (err) {
              reject(err);
            } else {
              const payload = res.data.payload;
              resolve(payload);
            }
          }
        );
      }
    );

    const messageInboxTimeHeader = latestMessageContent.headers.find(
      (header) => header.name === "Date"
    );
    const messageInboxTime = new Date(messageInboxTimeHeader?.value);
    let bodyContent = JSON.stringify(latestMessageContent?.body.data);

    let data, buff;
    data = bodyContent;
    buff = Buffer.from(data, "base64");
    const mailBody = buff.toString();

    return {
      body: convert(mailBody),
      receivedAt: DateTime.fromJSDate(messageInboxTime),
    };
  } catch (err) {
    throw err;
  }
};

export const extractOtpFromMail = (mailBody: string) => {
  return mailBody
    .split(/\r?\n/)
    .find((line) => line.includes("OTP:"))
    ?.split(":")?.[1]
    .trim();
};
