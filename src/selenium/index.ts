import chrome from "selenium-webdriver/chrome";
import { Builder, ThenableWebDriver, WebDriver } from "selenium-webdriver";
import { loginToKeka } from "./login";

const screen = {
  width: 640,
  height: 480,
};

export const loadKeka = async (): Promise<WebDriver> => {
  let driver: WebDriver;
  const options = new chrome.Options();
  options.setUserPreferences({
    "profile.default_content_setting_values.geolocation": 2,
  });
  options.windowSize(screen);

  driver = new Builder().forBrowser("chrome").setChromeOptions(options).build();
  await driver.get("https://app.keka.com/Account/KekaLogin");

  try {
    await loginToKeka(driver);
    return driver;
  } catch (error) {
    if (error instanceof Error && error.message === "captcha-failed") {
      driver.close();
      return loadKeka();
    }
  }
};
