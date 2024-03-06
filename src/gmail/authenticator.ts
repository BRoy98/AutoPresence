// const { google } = require("googleapis");
// const credentials = require("../credentials.json");

// const auth = new google.auth.OAuth2(
//   credentials.client_id,
//   credentials.client_secret,
//   "YOUR_REDIRECT_URL"
// );

//getAndStoreToken.js
"use strict";

import fs from "fs";
import path from "path";
import readline from "readline";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
import { promisify } from "util";
import { OAuth2Client } from "google-auth-library";

// Promisify with promise
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const rlQuestionAsync = promisify(rl.question);

// const TOKEN_PATH = path.join(process.cwd(), 'token.json');
// const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
const TOKEN_DIR = __dirname;
const TOKEN_PATH = "gmail-nodejs-quickstart.json";

export const authenticate = async () => {
  const content = await readFileAsync(
    path.join(__dirname, "../credentials.json")
  );
  console.log("content", content);
  const credentials = JSON.parse(content.toString()); //credential

  console.log("====================================");
  console.log("credentials", credentials);
  console.log("====================================");
  //authentication
  const clientSecret = credentials.web.client_secret;
  const clientId = credentials.web.client_id;
  const redirectUrl = credentials.web.redirect_uris[0];
  const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

  //get new token
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Authorize this app by visiting this url: ", authUrl);

  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();

    oauth2Client.getToken(code, async (err, token) => {
      if (err) {
        console.log("Error while trying to retrieve access token", err);
        return;
      }

      oauth2Client.credentials = token;

      try {
        fs.mkdirSync(TOKEN_DIR);
      } catch (err) {
        if (err.code != "EEXIST") throw err;
      }

      await writeFileAsync(
        path.join(TOKEN_DIR, "..", TOKEN_PATH),
        JSON.stringify(token)
      );
      console.log("Token stored to " + path.join(TOKEN_DIR, "..", TOKEN_PATH));
    });
  });
};
