const { timeout } = require("puppeteer");
const puppeteer = require("puppeteer");

let browserInstance = null;

async function startBrowser() {
  try {
    browserInstance = await puppeteer.launch({
      headless: "new", // Change to false if you need to see the browser
      // headless: false,
      defaultViewport: null,
      timeout: 10000,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--start-maximized",
        "--disable-http2", // Force HTTP/1.1 to avoid HTTP/2 protocol errors
        "--disable-blink-features=AutomationControlled",
        "--disable-features=IsolateOrigins,site-per-process,NetworkService,NetworkServiceInProcess",
        "--disable-web-security",
        "--disable-dev-shm-usage", // Important for Docker/K8s environments
        "--ignore-certificate-errors",
        "--allow-running-insecure-content",
      ],
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
