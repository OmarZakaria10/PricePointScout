const puppeteer = require("puppeteer");
const { getBrowser } = require("./browserInstance");
async function scrapeJumia(keyword) {
  const products = [];
  const browser = await getBrowser();
  const page = await browser.newPage();

  let pageNum = 1;
  while (pageNum < 10) {
    const path = `https://www.jumia.com.eg/catalog/?q=${encodeURIComponent(
      keyword
    )}&page=${pageNum}`;
    await page.goto(path);
    if (pageNum === 1) {
      const clsElement = await page.$(".cls");
      if (clsElement) {
          await clsElement.click();
      }
  }
  

    const productsHandles = await page.$$(
      ".-phs.-pvxs.row._no-g._4cl-3cm-shs > .c-prd"
    );

    if (productsHandles.length === 0) {
      break; // Exit loop if no products are found
    }

    for (const producthandle of productsHandles) {
      let title = "Null";
      let price = "Null";
      let link = "Null";
      let img = "Null";

      try {
        title = await page.evaluate(
          (el) => el.querySelector(".info > h3")?.textContent.trim() || "Null",
          producthandle
        );
      } catch (error) {}
      // console.log(title);

      try {
        price = await page.evaluate(
          (el) =>
            el.querySelector(".info > .prc")?.textContent.trim() || "Null",
          producthandle
        );
      } catch (error) {}
      // console.log(price);

      try {
        link = await page.evaluate(
          (el) => el.querySelector(" .core")?.getAttribute("href") || "Null",
          producthandle
        );
      } catch (error) {}

      try {
        img = await page.evaluate(
          (el) =>
            el.querySelector("article .img-c img")?.getAttribute("data-src") ||
            "Null",
          producthandle
        );
      } catch (error) {}

      if (title !== "Null" && price !== "Null") {
        const product = {
          title,
          price,
          link: `https://www.jumia.com.eg${link}`,
          img,
        };
        products.push(product);
      }
    }

    pageNum++;
  }

  console.log(products);

  await page.close();
  return products;
}

module.exports = scrapeJumia;
// Example usage:
// scrapeJumia("RTX 4060");
