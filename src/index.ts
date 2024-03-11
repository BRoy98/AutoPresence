require("dotenv").config();
import cron from "node-cron";
import { loadKeka } from "./selenium";
import { handleClockIn } from "./selenium/clock-in";
import { handleClockOut } from "./selenium/clock-out";
import { asyncDelay } from "./utils/delay";
import { initUserTable } from "./db";
import { sendNotification } from "./slack";
import { DateTime } from "luxon";
import { millisToMinutesAndSeconds } from "./utils/ms-to-min";
import "./server";
import { WebDriver } from "selenium-webdriver";

initUserTable();

const clockIn = async (delayMs) => {
  let driver: WebDriver;
  try {
    await asyncDelay(delayMs);
    driver = await loadKeka();
    await handleClockIn(driver);

    const successMessage = `✅ Clocked in 🕘 Successfully at: ${DateTime.now().toLocaleString(
      DateTime.DATETIME_MED
    )}`;
    await sendNotification({
      type: "success",
      message: successMessage,
    });
    console.log("====================================");
    console.log(successMessage);
    console.log("====================================");
  } catch (error) {
    driver.close();
    const errorMessage = `❌ Clock-In 🕘 failed at: ${DateTime.now().toLocaleString(
      DateTime.DATETIME_MED
    )}`;
    await sendNotification({
      type: "failure",
      message: errorMessage,
      data: error,
    });
    console.log("====================================");
    console.log(errorMessage);
    console.log(error);
    console.log("====================================");
  }
};

const clockOut = async (delayMs) => {
  let driver: WebDriver;
  try {
    await asyncDelay(delayMs);
    driver = await loadKeka();
    await handleClockOut(driver);

    const successMessage = `✅ Clocked out 🕕 Successfully at: ${DateTime.now().toLocaleString(
      DateTime.DATETIME_MED
    )}`;
    await sendNotification({
      type: "success",
      message: successMessage,
    });
    console.log("====================================");
    console.log(successMessage);
    console.log("====================================");
  } catch (error) {
    driver.close();
    const errorMessage = `❌ Clock-Out 🕕 failed at: ${DateTime.now().toLocaleString(
      DateTime.DATETIME_MED
    )}`;
    await sendNotification({
      type: "failure",
      message: errorMessage,
      data: error,
    });
    console.log("====================================");
    console.log(errorMessage);
    console.log(error);
    console.log("====================================");
  }
};

const run = async () => {
  cron.schedule("30 09 * * 1-5", () => {
    const delayMs = Math.floor(Math.random() * 1200000);
    const message = `🕘 Clock-in started at: ${DateTime.now().toLocaleString(
      DateTime.DATETIME_MED
    )}`;
    sendNotification({
      type: "success",
      message: message,
      data: `Delay: ${millisToMinutesAndSeconds(delayMs)} min`,
    });
    console.log("====================================");
    console.log(message);
    console.log("====================================");
    clockIn(0);
  });
  cron.schedule("14 21 * * 1-5", () => {
    const delayMs = Math.floor(Math.random() * 1200000);
    const message = `🕕 Clock-out started at: ${DateTime.now().toLocaleString(
      DateTime.DATETIME_MED
    )}`;
    sendNotification({
      type: "success",
      message: message,
      data: `Delay: ${millisToMinutesAndSeconds(delayMs)} min`,
    });
    console.log("====================================");
    console.log(message);
    console.log("====================================");
    clockOut(5000);
  });
};

run();
