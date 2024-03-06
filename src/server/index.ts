import express from "express";
import cookieSession from "cookie-session";
import { router as authRoutes } from "./auth";
const app = express();

app.set("view engine", "ejs");

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use("/auth", authRoutes);

app.use("/", (req, res) => {
  res.send("Hey people 👋");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("App listening on port " + port));
