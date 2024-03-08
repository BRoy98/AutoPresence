import { OAuth2Client } from "google-auth-library";
import { getUserByEmail, updateUserTokens } from "../db";

const CLIENT_ID = process.env.GCP_CLINT_ID;
const CLIENT_SECRET = process.env.GCP_CLINT_SECRET;
const REDIRECT_URI = `${process.env.REDIRECT_DOMAIN}/auth/google/callback`;

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export const getOAuthClient = async () => {
  const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

  const setCredentials = (userCredentials) => {
    oauth2Client.setCredentials(userCredentials);
    oauth2Client.on("tokens", async (tokens) => {
      let user = getUserByEmail(userCredentials.email);
      if (!user) throw new Error("user re-auth failed");

      updateUserTokens(
        userCredentials.email,
        tokens.access_token,
        tokens.refresh_token
      );
    });
  };

  return {
    oauth2Client,
    setCredentials,
  };
};

export const generateGmailAuthUrl = (oauth2Client: OAuth2Client) => {
  //get new token
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  return authUrl;
};
