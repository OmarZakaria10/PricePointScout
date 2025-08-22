const BaseScraper = require("./BaseScraper");

class AmazonScraper extends BaseScraper {
  constructor() {
    const config = {
      name: "Amazon Egypt",
      baseUrl: "https://www.amazon.eg",
      searchUrl:
        "https://www.amazon.eg/s?k={keyword}&page={page}&language=en_AE&crid=5FAA3IUQSK98&sprefix=rtx+%2Caps%2C128&ref=nb_sb_noss_2",
      maxPages: 5,
      paginationType: "url",
      selectors: {
        productContainer:
          "#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-4-of-4.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-12-of-12.sg-col-8-of-8.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item",
        title: "h2 > span",
        price: ".a-price > .a-offscreen",
        link: ".a-link-normal",
        image: ".s-image",
        endOfResults:
          "#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div.a-section.a-spacing-none.s-result-item.s-flex-full-width.s-border-bottom-none.s-widget.s-widget-spacing-large > div > div > div > div:nth-child(1) > span:nth-child(1)",
      },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      waitOptions: { waitUntil: "networkidle2" },
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

    // Make Amazon link absolute
    if (product.link !== "Null" && !product.link.startsWith("http")) {
      product.link = `https://www.amazon.eg${product.link}`;
    }

    return product;
  }
}

// Export function for backward compatibility
async function scrapeAmazon(keyword) {
  const scraper = new AmazonScraper();
  return await scraper.scrape(keyword);
}

// const test = async () => console.log(await scrapeAmazon("rtx"));
// test();

module.exports = scrapeAmazon;
