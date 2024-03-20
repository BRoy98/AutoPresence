import chrome from "selenium-webdriver/chrome";
import { Builder, WebDriver } from "selenium-webdriver";
import { loginToKeka } from "./login";
import { asyncDelay } from "../utils/delay";
import { sendNotification } from "../slack";

const screen = {
  width: 640,
  height: 480,
};

let retryCount = 0;

export const loadKeka = async (): Promise<WebDriver> => {
  let driver: WebDriver;
  const options = new chrome.Options();
  // options.setUserPreferences({
  //   "profile.default_content_setting_values.geolocation": 2,
  // });
  options.addArguments("--deny-permission-prompts");
  // options.addArguments("--headless");
  options.windowSize(screen);

  driver = new Builder().forBrowser("chrome").setChromeOptions(options).build();
  await driver.get("https://app.keka.com/Account/KekaLogin");

  try {
    await loginToKeka(driver);
    await asyncDelay(5000);

    if (retryCount > 3) retryCount = 0;
    return driver;
  } catch (error) {
    if (error instanceof Error && error.message === "captcha-failed") {
      console.log("====================================");
      console.log("Captcha failed. Retrying...");
      console.log("====================================");
    } else {
      console.log("====================================");
      console.log(" Load keka Failed", error);
      console.log("====================================");
    }

    if (retryCount > 3) {
      const error = "Process failed more than 3 times. Stopped retry process.";
      await sendNotification({
        type: "failure",
        message: error,
        data: error,
      });
      throw new Error(error);
    }

    retryCount += 1;
    driver.close();
    return loadKeka();
  }
};
