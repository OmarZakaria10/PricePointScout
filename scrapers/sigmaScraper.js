const puppeteer = require("puppeteer");

async function scrapeSigma(keyword) {
  const path = "https://www.sigma-computer.com/home";
  const products = [];

  const browser = await puppeteer.launch({
    // headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();

  await page.goto(path);
  await page.click("ul.top-link.list-inline.lang-curr li:nth-of-type(2) a");
  await page.waitForSelector("#search-box");

  await page.click("#search-box");
  await page.type("#search-box", keyword);

  await page.keyboard.press("Enter");

  await page.waitForNavigation({ waitUntil: "networkidle2" });

  await page.waitForSelector("#show_items");

  const productsHandles = await page.$$("#show_items > .product-layout ");

  for (const producthandle of productsHandles) {
    let title = "Null";
    let price = "Null";
    let link = "Null";
    let img = "Null";

    try {
      title = await page.evaluate(
        (el) =>
          el
            .querySelector(
              "div > div.right-block > div.caption.hide-cont > h4 > a"
            )
            ?.textContent.trim() || "Null",
        producthandle
      );
    } catch (error) {}
    // console.log(title);

    try {
      price = await page.evaluate(
        (el) =>
          el
            .querySelector(
              "div > div.right-block > div.row > div:nth-child(2) > p > span.price-new"
            )
            ?.textContent.trim() || "Null",
        producthandle
      );
    } catch (error) {}
    // console.log(price);
    try {
      link = await page.evaluate(
        (el) =>
          el
            .querySelector(
              " div > div.right-block > div.caption.hide-cont > h4 > a"
            )
            ?.getAttribute("href") || "Null", // link to product page
        producthandle
      );
    } catch (error) {}

    try {
      img = await page.evaluate(
        (el) =>
          el
            .querySelector("div > div.left-block.left-b > div > a > .img-1")
            ?.getAttribute("src") || "Null", // image src
        producthandle
      );
    } catch (error) {}

    // Only add valid products
    if (title !== "Null" && price !== "Null") {
      const product = {
        title,
        price,
        link: `https://www.sigma-computer.com/${link}`, // Make link absolute
        img: `https://www.sigma-computer.com/${img}`,
      };
      products.push(product);
    }
  }

  // console.log(products);

  await browser.close();
  return products;
}

module.exports = scrapeSigma;
// Example usage:
// scrapeSigma("SSD");
