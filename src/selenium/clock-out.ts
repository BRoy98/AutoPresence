import { By, ThenableWebDriver, until } from "selenium-webdriver";

export const clockOut = async (driver: ThenableWebDriver) => {
  try {
    await driver.get("https://expian.keka.com/#/me/attendance/logs");
    await driver.wait(
      until.elementLocated(By.xpath('//a[text()="Web Clock-out"]')),
      5000
    );

    const clockOutButton = driver.findElement(
      By.xpath('//a[text()="Web Clock-out"]')
    );

    await clockOutButton.click();

    await driver.wait(
      until.elementLocated(By.xpath('//a[text()="Clock-out"]')),
      5000
    );
    const finalClockOutButton = driver.findElement(
      By.xpath('//a[text()="Web Clock-out"]')
    );
    await finalClockOutButton.click();

    // wait for the ClockIn button to be visible, which means clocked out successfully
    await driver.wait(
      until.elementLocated(By.xpath('//button[text()="Web Clock-In"]')),
      5000
    );
    console.log("====================================");
    console.log("Clocked out Successfully");
    console.log("====================================");
  } catch (error) {
    console.log("====================================");
    console.log("Clock-Out failed");
    console.log("====================================");
  }
};
