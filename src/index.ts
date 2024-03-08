require("dotenv").config();
import cron from "node-cron";
import { loadKeka } from "./selenium";
import { handleClockIn } from "./selenium/clock-in";
import { handleClockOut } from "./selenium/clock-out";
import { asyncDelay } from "./utils/delay";
import { initUserTable } from "./db";
import "./server";
import { sendNotification } from "./slack";
import { DateTime } from "luxon";
import { millisToMinutesAndSeconds } from "./utils/ms-to-min";

initUserTable();

const clockIn = async (delayMs) => {
  try {
    await asyncDelay(delayMs);
    const driver = await loadKeka();
    handleClockIn(driver);

    const successMessage = `✅ Clocked in 🕘 Successfully at: ${DateTime.now().toLocaleString(
      DateTime.DATETIME_MED
    )}`;
    await sendNotification(successMessage);
    console.log("====================================");
    console.log(successMessage);
    console.log("====================================");
  } catch (error) {
    const errorMessage = `❌ Clock-In 🕘 failed at: ${DateTime.now().toLocaleString(
      DateTime.DATETIME_MED
    )}`;
    await sendNotification(errorMessage, error);
    console.log("====================================");
    console.log(errorMessage);
    console.log(error);
    console.log("====================================");
  }
};

const clockOut = async (delayMs) => {
  try {
    await asyncDelay(delayMs);
    const driver = await loadKeka();
    handleClockOut(driver);

    const successMessage = `✅ Clocked out 🕕 Successfully at: ${DateTime.now().toLocaleString(
      DateTime.DATETIME_MED
    )}`;
    await sendNotification(successMessage);
    console.log("====================================");
    console.log(successMessage);
    console.log("====================================");
  } catch (error) {
    const errorMessage = `❌ Clock-Out 🕕 failed at: ${DateTime.now().toLocaleString(
      DateTime.DATETIME_MED
    )}`;
    await sendNotification(errorMessage, error);
    console.log("====================================");
    console.log(errorMessage);
    console.log(error);
    console.log("====================================");
  }
};

const run = async () => {
  cron.schedule("50 9 * * 1-5", () => {
    const delayMs = Math.floor(Math.random() * 1200000);
    const message = `🕘 Clock-in started at: ${DateTime.now().toLocaleString(
      DateTime.DATETIME_MED
    )}`;
    sendNotification(
      message,
      `Delay: ${millisToMinutesAndSeconds(delayMs)} min`
    );
    console.log("====================================");
    console.log(message);
    console.log("====================================");
    clockIn(delayMs);
  });
  cron.schedule("10 19 * * 1-5", () => {
    const delayMs = Math.floor(Math.random() * 1200000);
    const message = `🕕 Clock-out started at: ${DateTime.now().toLocaleString(
      DateTime.DATETIME_MED
    )}`;
    sendNotification(
      message,
      `Delay: ${millisToMinutesAndSeconds(delayMs)} min`
    );
    console.log("====================================");
    console.log(message);
    console.log("====================================");
    clockOut(delayMs);
  });
};

run();
