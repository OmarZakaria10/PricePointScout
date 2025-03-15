const puppeteer = require("puppeteer");

let browserInstance = null;

async function startBrowser() {
  try {
    browserInstance = await puppeteer.launch({
      headless: false, // Change to false if you need to see the browser
      defaultViewport: null,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--start-maximized"],
    });
    return browserInstance;
  } catch (err) {
    console.log("Failed to create browser instance:", err);
  }
}
function getBrowser() {
  if (!browserInstance) {
    // throw new Error('Browser not initialized! Please start the browser first.');
    browserInstance = startBrowser();
  }
  return browserInstance;
}

async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
    console.log("Browser closed successfully");
  }
}
module.exports = { startBrowser, getBrowser, closeBrowser };
