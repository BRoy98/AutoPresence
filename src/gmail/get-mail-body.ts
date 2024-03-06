import fs from "fs";
import path from "path";
import { promisify } from "util";
import { google, gmail_v1 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { DateTime } from "luxon";

const gmail = google.gmail("v1");

// Promisify with promise
const readFileAsync = promisify(fs.readFile);

// Gmail label list
const TOKEN_PATH = "../gmail-nodejs-quickstart.json"; // Specify the access token file

export const getLatestMailFromLabel = async (
  labelIds: Array<string>
): Promise<{
  body: string;
  receivedAt: DateTime;
}> => {
  // Get credential information
  const content = await readFileAsync(
    path.join(__dirname, "../credentials.json")
  );
  // specify the client secret file
  const credentials = JSON.parse(content.toString()); // credential

  // authentication
  const clientSecret = credentials.web.client_secret;
  const clientId = credentials.web.client_id;
  const redirectUrl = credentials.web.redirect_uris[0];
  const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);
  const token = await readFileAsync(path.join(__dirname, TOKEN_PATH));
  oauth2Client.credentials = JSON.parse(token.toString());

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
          if (err) {
            reject(err);
          } else {
            const messages = res.data.messages;
            resolve(messages?.[0]?.id);
          }
        }
      );
    });

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

    let bodyContent = JSON.stringify(
      latestMessageContent?.parts?.[0].body.data
    );

    let data, buff;
    data = bodyContent;
    buff = Buffer.from(data, "base64");
    const mailBody = buff.toString();

    return {
      body: mailBody,
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
