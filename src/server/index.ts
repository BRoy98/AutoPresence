import express from "express";
import { router as authRoutes } from "./auth";
const app = express();

app.set("view engine", "ejs");
app.set("trust proxy", 1);

app.use("/auth", authRoutes);

app.use("/hook/slack", (req: express.Request, res) => {
  console.log("====================================");
  console.log("body", req.body);
  console.log("body", req.header);
  console.log("====================================");
  return res.send("OK");
});

app.use("/", (req, res) => {
  res.send("Hey people 👋");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("App listening on port " + port));
