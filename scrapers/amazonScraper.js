const fs = require("fs");
const puppeteer = require("puppeteer");
const { getBrowser ,closeBrowser} = require("./browserInstance");
async function scrapeAmazon(keyword) {

  const browser= await getBrowser()
  const page = await browser.newPage();
  const products = [];
  let product = {};
  let pageNum = 1;
  while (pageNum < 10) {
    const path = `https://www.amazon.eg/s?k=${keyword.replace(
      " ",
      "+"
    )}&page=${pageNum}&language=en_AE&crid=5FAA3IUQSK98&sprefix=rtx+%2Caps%2C128&ref=nb_sb_noss_2`;

    await page.goto(path);
    // await page.screenshot({ path: "example.png" });
    try {
      const endOfResults = await page.$(
        "#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div.a-section.a-spacing-none.s-result-item.s-flex-full-width.s-border-bottom-none.s-widget.s-widget-spacing-large > div > div > div > div:nth-child(1) > span:nth-child(1)"
      );
      if (endOfResults) break;
    } catch (error) {}

    const productsHandles = await page.$$(
      "div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item"
    );

    for (const producthandle of productsHandles) {
      let title = "Null";
      let price = "Null";
      let link = "Null";
      let img = "Null";

      try {
        title = await page.evaluate(
          (el) => el.querySelector("h2 > span")?.textContent || "Null",
          producthandle
        );
      } catch (error) {}

      try {
        price = await page.evaluate(
          (el) =>
            el.querySelector(".a-price > .a-offscreen")?.textContent || "Null",
          producthandle
        );
      } catch (error) {}

      try {
        link = await page.evaluate(
          (el) =>
            el.querySelector(".a-link-normal")?.getAttribute("href") || "Null",
          producthandle
        );
      } catch (error) {}

      try {
        img = await page.evaluate(
          (el) => el.querySelector(".s-image")?.getAttribute("src") || "Null",
          producthandle
        );
      } catch (error) {}

      // Create the product object and push it to the products array
      if (title !== "Null") {
        product = {
          title,
          price,
          link,
          img,
        };
        products.push(product);
        // console.log(product);
      }
    }
    pageNum++;
  }
  // console.log(products);
  // console.log(products.length);
  return products;
  await page.close();
}

module.exports = scrapeAmazon;
// scrapeAmazon("RTX 4060");
