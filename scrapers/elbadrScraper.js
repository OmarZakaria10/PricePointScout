const { text } = require("express");
const BaseScraper = require("./BaseScraper");

class ElbadrScraper extends BaseScraper {
  constructor() {
    const config = {
      name: "Elbadr Group",
      baseUrl: "https://elbadrgroupeg.store",
      searchUrl:
        "https://elbadrgroupeg.store/index.php?route=product/search&search={keyword}&fq=1",
      maxPages: 1, // Single page results typically
      paginationType: "url",
      selectors: {
        productContainer:
          "#content > div.main-products-wrapper > div.main-products.main-products-style.product-grid.ipr-grid > .product-layout",
        title: "div > div.caption > div.name > a",
        price: "div > div.caption > div.price > div > span",
        link: "div > div.caption > div.name > a",
        image: "div > div.image-group > div > a > div > img",
      },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      waitOptions: { waitUntil: "networkidle2" },
    };

    super(config);
  }

  /**
   * Override initializeSearch to wait for specific content selector
   * @param {Page} page - Puppeteer page instance
   * @param {string} keyword - Search keyword
   */
  async initializeSearch(page, keyword) {
    const url = this.buildSearchUrl(keyword, 1);
    await page.goto(url, this.waitOptions);

    try {
      // Wait for the products container to load
      await page.waitForSelector(
        "#content > div.main-products-wrapper > div.main-products.main-products-style.product-grid.ipr-grid",
        { timeout: 10000 }
      );
    } catch (error) {
      console.error("Error waiting for Elbadr products container:", error);
      throw error;
    }
  }

  /**
   * Override scrape method to handle single page results
   * @param {string} keyword - Search keyword
   * @returns {Array} Array of product objects
   */
  async scrape(keyword) {
    const browser = await require("./browserInstance").getBrowser();
    const page = await browser.newPage();
    const products = [];

    try {
      await page.setUserAgent(this.userAgent);

      // Initialize the search
      await this.initializeSearch(page, keyword);

      // Extract products (typically single page)
      const pageProducts = await this.extractProductsFromPage(page);
      products.push(...pageProducts);

      console.log(`Elbadr scraping completed with ${products.length} products`);
    } catch (error) {
      console.error(`Error in ${this.name} scraper:`, error);
    } finally {
      await page.close();
    }

    return this.filterValidProducts(products);
  }

  /**
   * Override extractSingleProduct to handle Elbadr's specific structure
   * @param {Page} page - Puppeteer page instance
   * @param {ElementHandle} handle - Product element handle
   * @returns {Object} Product object
   */
  async extractSingleProduct(page, handle) {
    const product = {
      title: "Null",
      price: "Null",
      link: "Null",
      img: "Null",
    };

    try {
      // Extract title
      product.title = await page.evaluate((el) => {
        const titleElement = el.querySelector(
          "div > div.caption > div.name > a"
        );
        return titleElement?.textContent?.trim() || "Null";
      }, handle);

      // Extract price
      product.price = await page.evaluate((el) => {
        const priceElement = el.querySelector(
          "div > div.caption > div.price > div > span"
        );
        return priceElement?.textContent?.trim() || "Null";
      }, handle);

      // Extract link (already absolute in Elbadr)
      product.link = await page.evaluate((el) => {
        const linkElement = el.querySelector(
          "div > div.caption > div.name > a"
        );
        return linkElement?.getAttribute("href") || "Null";
      }, handle);

      // Extract image (already absolute in Elbadr)
      product.img = await page.evaluate((el) => {
        const imgElement = el.querySelector(
          "div > div.image-group > div > a > div > img"
        );
        return imgElement?.getAttribute("src") || "Null";
      }, handle);
    } catch (error) {
      console.error("Error extracting Elbadr product:", error);
    }

    return product;
  }
}

// Export function for backward compatibility
async function scrapeElbadr(keyword) {
  const scraper = new ElbadrScraper();
  return await scraper.scrape(keyword);
}
// test = async () => console.log(await scrapeElbadr("rtx"));
// test();

module.exports = scrapeElbadr;
