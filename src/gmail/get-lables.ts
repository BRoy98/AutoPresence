import fs from "fs";
import path from "path";
import { promisify } from "util";
import { google, gmail_v1 } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const gmail = google.gmail("v1");

// Promisify with promise
const readFileAsync = promisify(fs.readFile);

// Gmail label list
const TOKEN_PATH = "../gmail-nodejs-quickstart.json"; // Specify the access token file

export const getLabels = async (): Promise<Array<Label>> => {
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
    const labels: Array<Label> = await new Promise((resolve, reject) => {
      gmail.users.labels.list(
        {
          userId: "me",
          auth: oauth2Client,
        },
        function (err, res) {
          if (err) {
            reject(err);
          } else {
            const labels = res.data.labels;
            resolve(labels);
          }
        }
      );
    });
    return labels;
  } catch (err) {
    console.log("The API returned an error: " + err);
    throw err;
  }
};

export const getKekaLabel = async () => {
  const labels = await getLabels();
  const kekaLabel = labels.find((label) => label.name === "keka");

  if (!kekaLabel) {
    throw new Error("no label found with the name 'keka'");
  }

  return kekaLabel;
};
