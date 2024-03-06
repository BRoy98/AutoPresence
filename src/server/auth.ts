import express from "express";
import axios from "axios";
import session from "cookie-session";
import { createUser, getUserByEmail } from "../db";
const router = express.Router();

const CLIENT_ID = process.env.GCP_CLINT_ID;
const CLIENT_SECRET = process.env.GCP_CLINT_SECRET;
const REDIRECT_URI = `${process.env.REDIRECT_DOMAIN}/auth/google/callback`;

// Initiates the Google Login flow
router.get("/google", (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  return res.redirect(url);
});

// Callback URL for handling the Google Login response
router.get("/google/callback", async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for access token
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { access_token, id_token } = data;

    // Use access_token or id_token to fetch user profile
    const { data: profile } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    // Code to handle user authentication and retrieval using the profile data
    console.log("====================================");
    console.log("profile", profile);
    console.log("====================================");

    let user = await getUserByEmail(profile.user);
    if (!user) {
      await createUser({
        ...profile,
        google_id: profile.id,
      });
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
