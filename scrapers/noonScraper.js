const BaseScraper = require("./BaseScraper");

class NoonScraper extends BaseScraper {
  constructor() {
    const config = {
      name: "Noon Egypt",
      baseUrl: "https://www.noon.com",
      searchUrl:
        "https://www.noon.com/egypt-en/search/?q={keyword}&page={page}",
      maxPages: 3,
      paginationType: "url",
      selectors: {
        productContainer:
          "#catalog-page-container > div > div > div.ProductListDesktop-module-scss-module__okqu8G__content > div.ProductListDesktop-module-scss-module__okqu8G__layoutWrapper > div",
        title:
          "a > div.ProductBoxVertical-module-scss-module__NG8XsG__wrapper > div.ProductDetailsSection-module-scss-module__Y6u1Qq__wrapper > h2",
        price:
          "a > div.ProductBoxVertical-module-scss-module__NG8XsG__wrapper > div.ProductDetailsSection-module-scss-module__Y6u1Qq__wrapper > div.ProductDetailsSection-module-scss-module__Y6u1Qq__priceNudgesCtr > div.Price-module-scss-module__q-4KEG__container.Price-module-scss-module__q-4KEG__pBox > div.Price-module-scss-module__q-4KEG__sellingPrice.Price-module-scss-module__q-4KEG__isRenderedOnNewProductBox > strong",
        link: "a:nth-child(1)",
        image:
          "a > div.ProductBoxVertical-module-scss-module__NG8XsG__wrapper > div.ProductImageSection-module-scss-module__8NuU7G__wrapper > div > div.ProductImageCarousel-module-scss-module__SlkSTG__wrapper > div.ProductImageCarousel-module-scss-module__SlkSTG__slidesWrapper > div:nth-child(1) > div > div > img",
      },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      waitOptions: {
        waitUntil: "domcontentloaded", // Less strict - don't wait for all network
        timeout: 90000, // 90 seconds timeout for Noon
      },
    };
    super(config);
  }

  /**
   * Override scrapeWithUrlPagination to add retry logic for HTTP/2 errors
   */
  async scrapeWithUrlPagination(page, keyword, products) {
    for (let pageNum = 1; pageNum <= this.maxPages; pageNum++) {
      let success = false;
      let retries = 3;

      while (retries > 0 && !success) {
        try {
          const url = this.buildSearchUrl(keyword, pageNum);

          // Navigate with retry-friendly options
          await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 90000,
          });

          // Wait a bit for JS to render products
          await new Promise((resolve) => setTimeout(resolve, 3000));

          // Try to wait for product container
          try {
            await page.waitForSelector(this.selectors.productContainer, {
              timeout: 15000,
            });
          } catch (e) {
            console.log(
              `Noon page ${pageNum}: Products not found, retrying...`
            );
            retries--;
            await new Promise((resolve) => setTimeout(resolve, 2000));
            continue;
          }

          const pageProducts = await this.extractProductsFromPage(page);
          products.push(...pageProducts);
          success = true;

          if (pageProducts.length === 0) {
            return; // End pagination if no products
          }
        } catch (error) {
          console.log(
            `Noon page ${pageNum} error (${retries} retries left): ${error.message}`
          );
          retries--;
          if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait before retry
          }
        }
      }

      if (!success) {
        console.log(`Noon: Failed to scrape page ${pageNum} after all retries`);
      }
    }
  }

  /**
   * Override buildSearchUrl to handle Amazon's specific URL format
   * @param {string} keyword - Search keyword
   * @param {number} pageNum - Page number
   * @returns {string} Complete search URL
   */
  buildSearchUrl(keyword, pageNum) {
    const encodedKeyword = encodeURIComponent(keyword);
    return this.searchUrl
      .replace("{keyword}", encodedKeyword)
      .replace("{page}", pageNum);
  }
  /**
   * Override extractSingleProduct to handle Amazon's specific link format
   * @param {Page} page - Puppeteer page instance
   * @param {ElementHandle} handle - Product element handle
   * @returns {Object} Product object
   */
  async extractSingleProduct(page, handle) {
    const product = await super.extractSingleProduct(page, handle);

    if (product.link !== "Null" && !product.link.startsWith("http")) {
      // console.log(product.link);
      product.link = `https://www.noon.com/${product.link}`;
    }

    return product;
  }
}

async function scrapeNoon(keyword) {
  const scraper = new NoonScraper();
  return await scraper.scrape(keyword);
}
module.exports = scrapeNoon;

// (async () => {
//   const data = await scrapeNoon("rtx");
//   console.log(data);
// })();
