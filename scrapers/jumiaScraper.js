const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { getBrowser, closeBrowser } = require("./browserInstance");
puppeteer.use(StealthPlugin());

async function scrapeJumia(keyword) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  let products = [];
  let pageNum = 1;

  while (pageNum < 5) {
    const url = `https://www.jumia.com.eg/catalog/?q=${encodeURIComponent(
      keyword
    )}&page=${pageNum}`;
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Handle cookie popup
    try {
      const clsElement = await page.$(".cls");
      if (clsElement) await clsElement.click();
    } catch (err) {
      console.log("No cookie popup found");
    }

    // Scroll to load all products
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));

    const productsHandles = await page.$$(
      ".-phs.-pvxs.row._no-g._4cl-3cm-shs > .c-prd"
    );

    if (productsHandles.length === 0) break;

    for (const producthandle of productsHandles) {
      let title = "Null",
        price = "Null",
        link = "Null",
        img = "Null";

      try {
        title = await page.evaluate(
          (el) => el.querySelector(".info > h3")?.textContent.trim() || "Null",
          producthandle
        );
      } catch {}

      try {
        price = await page.evaluate(
          (el) =>
            el.querySelector(".info > .prc")?.textContent.trim() || "Null",
          producthandle
        );
      } catch {}

      try {
        link = await page.evaluate(
          (el) => el.querySelector(" .core")?.getAttribute("href") || "Null",
          producthandle
        );
      } catch {}

      try {
        img = await page.evaluate(
          (el) =>
            el.querySelector("article .img-c img")?.getAttribute("data-src") ||
            "Null",
          producthandle
        );
      } catch {}

      if (title !== "Null" && price !== "Null") {
        products.push({
          title,
          price,
          link: `https://www.jumia.com.eg${link}`,
          img,
        });
      }
    }

    pageNum++;
  }

  await page.close();
  // console.log(products);
  return products;
}

// Example usage:
// scrapeJumia("coffee");
module.exports = scrapeJumia;
