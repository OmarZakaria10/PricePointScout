const puppeteer = require("puppeteer");

async function scrapeElbadr(keyword) {
  const path = `https://elbadrgroupeg.store/index.php?route=product/search&search=${encodeURIComponent(
    keyword
  )}&fq=1`;
  const products = [];

  const browser = await puppeteer.launch({
    // headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();

  await page.goto(path);

  await page.waitForSelector(
    "#content > div.main-products-wrapper > div.main-products.main-products-style.product-grid.ipr-grid"
  );
  const productsHandles = await page.$$(
    "#content > div.main-products-wrapper > div.main-products.main-products-style.product-grid.ipr-grid > .product-layout"
  );

  for (const producthandle of productsHandles) {
    let title = "Null";
    let price = "Null";
    let link = "Null";
    let img = "Null";

    try {
      title = await page.evaluate(
        (el) =>
          el
            .querySelector("div > div.caption > div.name > a")
            ?.textContent.trim() || "Null",
        producthandle
      );
    } catch (error) {}
    // console.log(title);

    try {
      price = await page.evaluate(
        (el) =>
          el.querySelector("div > div.caption > div.price > div > span")
            ?.textContent,
        producthandle
      );
    } catch (error) {}
    // console.log(price);

    try {
      link = await page.evaluate(
        (el) =>
          el
            .querySelector("div > div.caption > div.name > a")
            ?.getAttribute("href") || "Null",
        producthandle
      );
    } catch (error) {}

    try {
      img = await page.evaluate(
        (el) =>
          el
            .querySelector("div > div.image-group > div > a > div > img")
            ?.getAttribute("src"),
        producthandle
      );
    } catch (error) {}

    if (title !== "Null" && price !== "Null") {
      const product = {
        title,
        price,
        link,
        img,
      };
      products.push(product);
    }
  }

  // console.log(products);

  await browser.close();
  return products;
}

module.exports = scrapeElbadr;
// Example usage:
// scrapeElbadr("RTX 4060").then((products) => console.log(products));
