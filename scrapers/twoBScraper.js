const { timeout } = require("puppeteer");
const BaseScraper = require("./BaseScraper");

class twoBScraper extends BaseScraper {
  constructor() {
    const config = {
      name: "2B Egypt",
      baseUrl: "https://2b.com.eg/en/",
      searchUrl:
        "https://2b.com.eg/en/catalogsearch/result?p={page}&q={keyword}",
      maxPages: 2,
      paginationType: "url",
      selectors: {
        productContainer: "ol.filterproducts li.item.product.product-item",
        title: "a.product-item-link",
        price: "span.special-price span.price-wrapper span.price",
        link: "a.product-item-link",
        image: "img.product-image-photo",
      },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      waitOptions: { waitUntil: "domcontentloaded", timeout: 40000 },
      waitForSelector: "ol.filterproducts",
      
    };
    super(config);
  }
  buildSearchUrl(keyword, pageNum) {
    const encodedKeyword = encodeURIComponent(keyword);
    return this.searchUrl
      .replace("{keyword}", encodedKeyword)
      .replace("{page}", pageNum);
  }
  async extractSingleProduct(page, handle) {
    const product = await super.extractSingleProduct(page, handle);

    if (product.link !== "Null" && !product.link.startsWith("http")) {
      product.link = `https://2b.com.eg${product.link}`;
    }

    return product;
  }
}

async function scrapeTwoB(keyword) {
  const scraper = new twoBScraper();
  return await scraper.scrape(keyword);
}

// const test = async () => console.log(await scrapeTwoB("iphone"));
// test();

module.exports = scrapeTwoB;
