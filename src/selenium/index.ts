import chrome from "selenium-webdriver/chrome";
import { Builder } from "selenium-webdriver";
import { loginToKeka } from "./login";

const screen = {
  width: 640,
  height: 480,
};

export const doShit = async (isMorning: boolean) => {
  const options = new chrome.Options();
  options.setUserPreferences({
    "profile.default_content_setting_values.geolocation": 2,
  });
  options.windowSize(screen);

  let driver = new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  await driver.get("https://app.keka.com/Account/KekaLogin");

  await loginToKeka(driver);
  return driver;
};
