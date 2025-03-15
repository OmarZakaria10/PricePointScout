const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { getBrowser } = require("./browserInstance");
puppeteer.use(StealthPlugin());
async function scrapeNoon(keyword) {
  const path =
    "https://www.noon.com/egypt-en/?utm_source=C1000088L&utm_medium=cpc&utm_campaign=C1000151355N_eg_en_web_searchxxexactandphrasexxbrandpurexx08082022_noon_web_c1000088l_acquisition_sembranded_&gad_source=1&gclid=CjwKCAiAqrG9BhAVEiwAaPu5zmxVnj-z53T9isNFm6plA3VmW_F1fWD6AvCWo7j2R3qsId8fL7iuLRoCHnAQAvD_BwE";
  const products = [];

  const browser = await getBrowser();
  const page = await browser.newPage();

  const searchBarSelector =
    "#default-header-desktop > header > div > div.DesktopSiteSearch_wrapper__5Zy5v.HeaderDesktop_searchWrapper__CE_gg > div.DesktopInput_inputWrapper__Ke1A9 > input";

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  await page.goto(path);
  // await page.waitForSelector(searchBarSelector);
  await page.click(searchBarSelector);
  await page.type(searchBarSelector, keyword);
  await page.keyboard.press("Enter");
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  let title = "Null";
  let price = "Null";
  let link = "Null";
  let img = "Null";

  for (let i = 0; i < 3; i++) {
    // await page.waitForSelector(
    // "#__next > div > section > div > div > div.sc-796e5e26-3.gVWVXu > div.sc-796e5e26-7.hRyVVv.grid"
    // );
    const productsHandles = await page.$$(
      "#__next > div > section > div > div > div.sc-796e5e26-3.gVWVXu > div.sc-796e5e26-7.hRyVVv.grid > span"
    );
    await autoScroll(page);
    for (const productHandle of productsHandles) {
      try {
        title = await page.evaluate(
          (el) =>
            el
              .querySelector(
                ".eSrvHE > a > div > div > div.sc-433dbb72-1.kCPylA > div:nth-child(1) > div > div.sc-47ce7046-1.fuvgwB > div.sc-47ce7046-2.uMZsC > div:nth-child(2) > div > div > div > img"
              )
              ?.getAttribute("alt")
              .trim() || "Null",
          productHandle
        );
        // console.log(title);
      } catch (error) {
        console.log(error);
      }
      try {
        price = await page.evaluate(
          (el) =>
            el
              .querySelector(
                ".eSrvHE > a > div > div > div.sc-433dbb72-23.gUfohz > div.sc-433dbb72-26.ymgIA > div > div.sc-97957b12-1.fYKLkk > strong"
              )
              ?.textContent.trim() || "Null",
          productHandle
        );
        // price = price.replace(",", "");
        // console.log(price);
      } catch (error) {
        console.log(error);
      }
      try {
        link = await page.evaluate(
          (el) =>
            el.querySelector(".eSrvHE > a ")?.getAttribute("href") || "Null",
          productHandle
        );
        link = `https://www.noon.com/${link}`;
      } catch (error) {
        console.log(error);
      }
      try {
        img = await page.evaluate(
          (el) =>
            el.querySelector(
              ".eSrvHE > a > div > div > div.sc-433dbb72-1.kCPylA > div:nth-child(1) > div > div.sc-47ce7046-1.fuvgwB > div.sc-47ce7046-2.uMZsC > div:nth-child(2) > div > div > div > img "
            )?.src || "Null",
          productHandle
        );
      } catch (error) {}
      products.push({ title, price, link, img });
    }
    try {
      // await page.waitForSelector(
      // "#__next > div > section > div > div > div.sc-796e5e26-3.gVWVXu > div.sc-796e5e26-8.kpOZck > div > ul > li.next > a > div > img",
      // { timeout: 1000 }
      // );
      await page.click(
        "#__next > div > section > div > div > div.sc-796e5e26-3.gVWVXu > div.sc-796e5e26-8.kpOZck > div > ul > li.next > a > div > img",
        { timeout: 1000 }
      );
    } catch (error) {
      if (error.name === "TimeoutError") {
        break;
      }
    }
  }
  await page.close();
  // console.log(products);
  return products;
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 200;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 10);
    });
  });
}

module.exports = scrapeNoon;
