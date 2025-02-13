const puppeteer = require("puppeteer");
const { getBrowser } = require("./browserInstance");


async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function scrapeCompuMart(keyword) {
  const products = [];

  const browser = await getBrowser();
  const page = await browser.newPage();

  const path = `https://www.compumarts.com/search?q=${encodeURIComponent(
    keyword
  )}&type=product&options%5Bprefix%5D=last&filter.v.availability=1&filter.v.price.gte=&filter.v.price.lte=`;

  await page.goto(path, { waitUntil: "networkidle2" }); // Ensure full page load
  await autoScroll(page); // Call autoScroll separately

  const productsHandles = await page.$$("#main-collection-product-grid > li");

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
              "div > div > div.card-information > div.card-information__wrapper.text-center > h3"
            )
            ?.textContent.trim() || "Null",
        producthandle
      );
    } catch (error) {
      console.error("Error extracting title:", error);
    }
    // console.log(title);

    try {
      price = await page.evaluate(
        (el) =>
          el
            .querySelector(
              "div > div > div.card-information > div.card-information__wrapper.text-center > div.card-price > div > dl > div.price__sale > dd.price__last > span"
            )
            ?.textContent.trim() || "Null",
        producthandle
      );
    } catch (error) {
      console.error("Error extracting price:", error);
    }
    // console.log(price);

    try {
      link = await page.evaluate(
        (el) =>
          el
            .querySelector(
              "div > div > div.card-information > div.card-information__wrapper.text-center > h3 > a"
            )
            .getAttribute("href") || "Null",
        producthandle
      );
    } catch (error) {
      console.error("Error extracting link:", error);
    }
    link = `https://www.compumarts.com/${link}`;

    try {
      img = await page.evaluate((el) => {
        const imgElement = el.querySelector(
          "div > div.card-media.card-media--square.media--hover-effect.has-compare.media--loading-effect > img:nth-child(2)"
        );
        if (!imgElement) return "Null"; // Ensure the image element exists

        let srcset = imgElement.getAttribute("srcset");
        if (srcset) {
          return "https:" + srcset.split(",")[0].split(" ")[0]; // Extract the first URL
        }

        // Fallback to `src` if `srcset` is missing
        return "https:" + (imgElement.getAttribute("src") || "Null");
      }, producthandle);
    } catch (error) {
      console.error("Error extracting image:", error);
    }
    // console.log(img);

    products.push({ title, price, link, img });
  }

  await page.close();
  // await browser.close();
  return products;
}

module.exports = scrapeCompuMart;

// Example usage:
// scrapeCompuMart("RTX 4060");
