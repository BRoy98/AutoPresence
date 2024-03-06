import { DateTime } from "luxon";
import { getKekaLabel } from "../gmail/get-lables";
import {
  extractOtpFromMail,
  getLatestMailFromLabel,
} from "../gmail/get-mail-body";
import { By, ThenableWebDriver, until } from "selenium-webdriver";
import { dataURLtoFile } from "../utils/data-to-file";
import { readCaptcha } from "../vision/read-captcha";

const readOTP = async () => {
  const kekaLabel = await getKekaLabel();
  const latestMail = await getLatestMailFromLabel([kekaLabel.id]);

  if (DateTime.now().diff(latestMail.receivedAt).milliseconds > 60000) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("====================================");
        console.log(
          "No mail found in last 1 minute. Retrying in 10 seconds..."
        );
        console.log("====================================");
        resolve(readOTP());
      }, 10000);
    });
  }

  const otp = extractOtpFromMail(JSON.parse(JSON.stringify(latestMail.body)));
  return otp;
};

export const loginToKeka = async (driver: ThenableWebDriver) => {
  // ------------------------------------------------------------
  // AUTHENTICATION
  // ------------------------------------------------------------
  const emailInput = driver.findElement(By.xpath("//input[@id='email']"));
  const passwordInput = driver.findElement(By.xpath("//input[@id='password']"));
  const captchaImg = driver.findElement(By.xpath("//img[@id='imgCaptcha']"));
  const captchaInput = driver.findElement(By.xpath("//input[@id='captcha']"));
  const loginButton = driver.findElement(By.xpath('//button[text()="Login"]'));

  emailInput.sendKeys(process.env.EMAIL);
  passwordInput.sendKeys(process.env.PASSWORD);

  const captchaBase64 = await captchaImg.getAttribute("src");

  dataURLtoFile(captchaBase64, "captcha.png");
  const captchaText = await readCaptcha("captcha.png");

  console.log("====================================");
  console.log("Captcha", captchaText);
  console.log("====================================");

  await captchaInput.sendKeys(captchaText);

  await loginButton.click();

  // wait for page to load and OTP buttons to get visible
  await driver.wait(
    until.elementLocated(
      By.xpath(
        `//button[contains(@class, '')]//*[contains(., 'Send code to email')]/..`
      )
    ),
    5000
  );
  const emailOTPButton = driver.findElement(
    By.xpath(
      `//button[contains(@class, '')]//*[contains(., 'Send code to email')]/..`
    )
  );

  await emailOTPButton.click();

  await fillCaptcha(driver);
};

const fillCaptcha = async (driver: ThenableWebDriver) => {
  // wait for page to load and OTP input to get visible
  await driver.wait(
    until.elementLocated(By.xpath(`//input[@id='code']`)),
    5000
  );
  const otpInput = driver.findElement(By.xpath("//input[@id='code']"));
  const otpLoginButton = driver.findElement(
    By.xpath('//button[text()="Login"]')
  );

  const otp = await readOTP();
  console.log("====================================");
  console.log("OTP", otp);
  console.log("====================================");

  await otpInput.sendKeys(otp as string);
  await otpLoginButton.click();
};
