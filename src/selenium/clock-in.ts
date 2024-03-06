import { By, ThenableWebDriver, until } from "selenium-webdriver";

export const clockIn = async (driver: ThenableWebDriver) => {
  try {
    await driver.get("https://expian.keka.com/#/me/attendance/logs");
    await driver.wait(
      until.elementLocated(By.xpath('//a[text()="Web Clock-In"]')),
      5000
    );

    const clockInButton = driver.findElement(
      By.xpath('//a[text()="Web Clock-In"]')
    );
    await clockInButton.click();

    await driver.wait(until.elementLocated(By.className("ki-close ki")), 5000);

    const closeLocationPopupButton = driver.findElement(
      By.xpath('//a[text()="Web Clock-In"]')
    );
    await closeLocationPopupButton.click();

    // wait for the ClockOut button to be visible, which means clocked in successfully
    await driver.wait(
      until.elementLocated(By.xpath('//button[text()="Web Clock-out"]')),
      5000
    );
    console.log("====================================");
    console.log("Clocked in Successfully");
    console.log("====================================");
  } catch (error) {
    console.log("====================================");
    console.log("Clock-In failed");
    console.log("====================================");
  }
};
