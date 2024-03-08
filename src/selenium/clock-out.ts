import { By, WebDriver, until } from "selenium-webdriver";

export const handleClockOut = async (driver: WebDriver) => {
  await driver.get("https://expian.keka.com/#/me/attendance/logs");
  await driver.wait(
    until.elementLocated(By.xpath('//button[text()="Web Clock-out"]')),
    5000
  );

  const clockOutButton = driver.findElement(
    By.xpath('//button[text()="Web Clock-out"]')
  );

  await clockOutButton.click();

  await driver.wait(
    until.elementLocated(By.xpath('//button[text()="Clock-out"]')),
    5000
  );
  const finalClockOutButton = driver.findElement(
    By.xpath('//button[text()="Clock-out"]')
  );
  await finalClockOutButton.click();

  const closeLocationPopupIdentifier = By.xpath(
    "//span[contains(@class, 'ki') and contains(@class ,'ki-close')]"
  );
  await driver.wait(until.elementLocated(closeLocationPopupIdentifier), 5000);
  const closeLocationPopupButton = driver.findElement(
    closeLocationPopupIdentifier
  );
  await closeLocationPopupButton.click();

  // wait for the ClockIn button to be visible, which means clocked out successfully
  await driver.wait(
    until.elementLocated(By.xpath('//a[text()="Web Clock-In"]')),
    5000
  );
  console.log("====================================");
  console.log("Clocked out Successfully");
  console.log("====================================");
};
