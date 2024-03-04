import chrome from "selenium-webdriver/chrome";
import { Builder, By, Key, until } from "selenium-webdriver";
import { dataURLtoFile } from "./data-to-file";
import { readCaptcha } from "./read-captcha";

require("dotenv").config();

const screen = {
  width: 640,
  height: 480,
};

let driver = new Builder()
  .forBrowser("chrome")
  .setChromeOptions(new chrome.Options().windowSize(screen))
  .build();

const open = async () => {
  await driver.get("https://app.keka.com/Account/KekaLogin");

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
  await captchaInput.sendKeys(captchaText);

  // loginButton.click();
};

open();
