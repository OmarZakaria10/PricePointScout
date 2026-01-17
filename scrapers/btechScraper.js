const BaseScraper = require("./BaseScraper");

class BtechScraper extends BaseScraper {
  constructor() {
    const config = {
      name: "Btech",
      baseUrl: "https://btech.com",
      searchUrl: "https://btech.com/en/s?q={keyword}",
      paginationType: "scroll",
      maxPages: 2,
      selectors: {
        productContainer: "article, [data-testid*='product'], div[class*='product-card'], div.flex.flex-col:has(footer a):has(footer span)",
        title: "footer > a",
        price: "footer > div > div > span.text-medium",
        link: "footer > a",
        image: "header > div.flex.items-center.justify-center.w-full > img",
      },
      scrollOptions: { delay: 5, distance: 200 },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    };
    super(config);
  };


  // buildSearchUrl(keyword, pageNum) {
  //   const encodedKeyword = encodeURIComponent(keyword);
  //   return this.searchUrl
  //     .replace("{keyword}", encodedKeyword)
  //     .replace("{page}", pageNum);
  // }
}
async function scrapeBtech(keyword) {
  const scraper = new BtechScraper();
  return await scraper.scrape(keyword);
}

// const test = async () => console.log(await scrapeBtech("iphone"));
// test();

module.exports = scrapeBtech;