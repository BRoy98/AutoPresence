import { DateTime } from "luxon";
import { getKekaLabel } from "../gmail/get-lables";
import {
  extractOtpFromMail,
  getLatestMailFromLabel,
} from "../gmail/get-mail-body";
import { By, WebDriver, until } from "selenium-webdriver";
import { dataURLtoFile } from "../utils/data-to-file";
import { readCaptcha } from "../vision/read-captcha";
import { asyncDelay } from "../utils/delay";

export const readOTP = async () => {
  const kekaLabel = await getKekaLabel();
  const latestMail = await getLatestMailFromLabel([kekaLabel.id]);

  if (DateTime.now().diff(latestMail.receivedAt).milliseconds > 60000) {
    console.log("====================================");
    console.log("No mail found in last 1 minute. Retrying in 10 seconds...");
    console.log("====================================");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(readOTP());
      }, 10000);
    });
  }

  const otp = extractOtpFromMail(JSON.parse(JSON.stringify(latestMail.body)));
  return otp;
};

export const loginToKeka = async (driver: WebDriver) => {
  // ------------------------------------------------------------
  // AUTHENTICATION
  // ------------------------------------------------------------
  const emailInput = driver.findElement(By.xpath("//input[@id='email']"));
  const passwordInput = driver.findElement(By.xpath("//input[@id='password']"));
  const captchaImg = driver.findElement(By.xpath("//img[@id='imgCaptcha']"));
  const captchaInput = driver.findElement(By.xpath("//input[@id='captcha']"));
  const loginButton = driver.findElement(By.xpath('//button[text()="Login"]'));

  emailInput.sendKeys(process.env.KEKA_EMAIL);
  passwordInput.sendKeys(process.env.KEKA_PASSWORD);

  const captchaBase64 = await captchaImg.getAttribute("src");
  dataURLtoFile(captchaBase64, "captcha.png");
  const captchaText = await readCaptcha("captcha.png");

  console.log("====================================");
  console.log("Captcha:", captchaText);
  console.log("====================================");

  await captchaInput.sendKeys(captchaText);
  await loginButton.click();

  let captchaFailed;
  try {
    await asyncDelay(2000);
    const invalidCaptchaText =
      '//*[contains(text(), "Invalid Captcha. Please try again.")]';
    await driver.wait(until.elementLocated(By.xpath(invalidCaptchaText)), 5000);
    captchaFailed = await driver.findElement(By.xpath(invalidCaptchaText));
  } catch (error) {}

  if (captchaFailed) {
    throw new Error("captcha-failed");
  }

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

  await fillOTP(driver);
};

const fillOTP = async (driver: WebDriver) => {
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
  console.log("OTP: ", otp);
  console.log("====================================");

  await otpInput.sendKeys(otp as string);
  await otpLoginButton.click();
};
