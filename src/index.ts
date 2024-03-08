require("dotenv").config();
import cron from "node-cron";
import { loadKeka } from "./selenium";
import { handleClockIn } from "./selenium/clock-in";
import { handleClockOut } from "./selenium/clock-out";
import { asyncDelay } from "./utils/delay";
import { initUserTable } from "./db";
import "./server";

initUserTable();

const clockIn = async (delayMs) => {
  try {
    await asyncDelay(delayMs);
    const driver = await loadKeka();
    await asyncDelay(5000);
    handleClockIn(driver);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    console.log("====================================");
    console.log("Clock-In failed");
    console.log("====================================");
  }
};

const clockOut = async (delayMs) => {
  try {
    await asyncDelay(delayMs);
    const driver = await loadKeka();
    await asyncDelay(5000);
    handleClockOut(driver);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    console.log("====================================");
    console.log("Clock-Out failed");
    console.log("====================================");
  }
};

const run = async () => {
  const driver = await loadKeka();
  cron.schedule("50 9 * * 1-5", () => {
    console.log("====================================");
    console.log("CRON RUNNING - IN");
    console.log("====================================");
    const delayMs = Math.floor(Math.random() * 1200000);
    clockIn(delayMs);
  });
  cron.schedule("10 19 * * 1-5", () => {
    console.log("====================================");
    console.log("CRON RUNNING - OUT");
    console.log("====================================");
    const delayMs = Math.floor(Math.random() * 1200000);
    clockOut(delayMs);
  });
};

run();
