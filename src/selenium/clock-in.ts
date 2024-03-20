import { By, WebDriver, until } from "selenium-webdriver";
import { asyncDelay } from "../utils/delay";

export const handleClockIn = async (driver: WebDriver) => {
  await driver.get("https://expian.keka.com/#/me/attendance/logs");
  await driver.wait(
    until.elementLocated(By.xpath('//a[text()="Web Clock-In"]')),
    5000
  );

  asyncDelay(2000);

  const clockInButton = driver.findElement(
    By.xpath('//a[text()="Web Clock-In"]')
  );
  await clockInButton.click();

  const closeLocationPopupIdentifier = By.xpath(
    "//span[contains(@class, 'ki') and contains(@class ,'ki-close')]"
  );
  await driver.wait(until.elementLocated(closeLocationPopupIdentifier), 5000);
  const closeLocationPopupButton = driver.findElement(
    closeLocationPopupIdentifier
  );
  await closeLocationPopupButton.click();

  // wait for the ClockOut button to be visible, which means clocked in successfully
  await driver.wait(
    until.elementLocated(By.xpath('//button[text()="Web Clock-out"]')),
    5000
  );
};
