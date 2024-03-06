require("dotenv").config();
import cron from "node-cron";
import { doShit } from "./selenium";
import "./server";
import { createUser, getUserByEmail } from "./db";

const run = async () => {};

run();

// const run = () => {
//   cron.schedule("55 9 * * *", () => {
//     const driver = doShit(true);
//   });
//   cron.schedule("10 19 * * *", () => {
//     const driver = doShit(true);
//   });
// };

// run();
