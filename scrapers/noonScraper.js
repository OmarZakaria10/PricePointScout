const BaseScraper = require("./BaseScraper");

class NoonScraper extends BaseScraper {
  constructor() {
    const config = {
      name: "Noon Egypt",
      baseUrl: "https://www.noon.com",
      searchUrl:
        "https://www.noon.com/egypt-en/search/?q={keyword}&page={page}",
      maxPages: 1,
      paginationType: "url",
      selectors: {
        productContainer:
          "#catalog-page-container > div.ProductListDesktop-module-scss-module__okqu8G__wrapper > div > div.ProductListDesktop-module-scss-module__okqu8G__content > div.ProductListDesktop-module-scss-module__okqu8G__layoutWrapper",
        title:
          " a > div.ProductBoxVertical-module-scss-module__NG8XsG__wrapper.ProductBoxVertical-module-scss-module__NG8XsG__isPboxRedesignEnabled > div.ProductDetailsSection-module-scss-module__Y6u1Qq__wrapper.ProductDetailsSection-module-scss-module__Y6u1Qq__isPboxRedesignEnabled > h2",
        price:
          " a > div.ProductBoxVertical-module-scss-module__NG8XsG__wrapper.ProductBoxVertical-module-scss-module__NG8XsG__isPboxRedesignEnabled > div.ProductDetailsSection-module-scss-module__Y6u1Qq__wrapper.ProductDetailsSection-module-scss-module__Y6u1Qq__isPboxRedesignEnabled > div.ProductDetailsSection-module-scss-module__Y6u1Qq__priceNudgesCtr > div.Price-module-scss-module__q-4KEG__container.Price-module-scss-module__q-4KEG__pBox.Price-module-scss-module__q-4KEG__isPboxRedesignEnabled > div.Price-module-scss-module__q-4KEG__sellingPrice.Price-module-scss-module__q-4KEG__isRenderedOnNewProductBox > strong",
        link: "a:nth-child(1)",
        image:
          " a > div.ProductBoxVertical-module-scss-module__NG8XsG__wrapper.ProductBoxVertical-module-scss-module__NG8XsG__isPboxRedesignEnabled > div.ProductImageSection-module-scss-module__8NuU7G__wrapper.ProductImageSection-module-scss-module__8NuU7G__isPboxRedesignEnabled > div > div.ProductImageCarousel-module-scss-module__SlkSTG__wrapper > div.ProductImageCarousel-module-scss-module__SlkSTG__slidesWrapper > div:nth-child(1) > div > div > img",
      },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      waitOptions: {
        waitUntil: "networkidle2",
        timeout: 60000, // 60 seconds timeout for Noon (slower site)
      },
    };
    super(config);
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

(async () => {
  const data = await scrapeNoon("laptop");
  console.log(data);
})();
