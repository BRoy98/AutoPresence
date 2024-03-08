import express from "express";
import axios from "axios";
import { createUser, getUserByEmail, updateUserTokens } from "../db";
import { generateGmailAuthUrl, getOAuthClient } from "../gmail/oauth";
const router = express.Router();

router.get("/google", async (req, res) => {
  const { oauth2Client } = await getOAuthClient();
  return res.redirect(generateGmailAuthUrl(oauth2Client));
});

// Callback URL for handling the Google Login response
router.get("/google/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const { oauth2Client, setCredentials } = await getOAuthClient();

    const { tokens } = await oauth2Client.getToken(code);
    setCredentials(tokens);

    // Use access_token or id_token to fetch user profile
    const { data: profile } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    let user = getUserByEmail(profile.email);
    if (!user) {
      createUser({
        ...profile,
        ...tokens,
        google_id: profile.id,
      });
    } else {
      updateUserTokens(
        profile.email,
        tokens.access_token,
        tokens.refresh_token
      );
    }
    return res.redirect("/");
  } catch (error) {
    console.error("Error:", error);
    return res.redirect("/login");
  }
});

// Logout route
router.get("/logout", (req, res) => {
  // Code to handle user logout
  return res.redirect("/login");
});

export { router };
