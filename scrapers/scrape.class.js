const scrapers = require("./scraper");
const cacheService = require("../utils/cacheService");
// const redisClient = require("../utils/redis");
const parsePrice = require("../utils/parsePrice");
class scrapeUtility {
  constructor(keyword, sources, sort, minPrice, maxPrice) {
    this.keyword = keyword;
    this.sort = sort;
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.results = [];
    this.cached = [];
    this.needsScraping = [];
    this.scraped = [];
    this.sources = sources
      ? sources.split(",").map((s) => s.trim().toLowerCase())
      : Object.keys(scrapers);
  }
  async getCachedResults() {
    const { cached, needsScraping } = await cacheService.getSourceResults(
      this.keyword,
      this.sources
    );
    this.cached = cached;
    this.needsScraping = needsScraping;
    return { cached, needsScraping };
  }
  async scrapeMissingSources() {
    try {
      var scrapePromises = this.needsScraping.map(async (source) => {
        const result = await scrapers[source](this.keyword);
        if (Array.isArray(result) && result.length > 0) {
          result.forEach((product) => {
            product.price = parsePrice(product.price);
          });
          return { source, data: result };
        }
        return { source, data: [], error: true };
      });
    } catch (error) {
      console.log(`Error scraping source ${source}:`, error);
      return { source, data: [], error: true };
    }
    const resultsfromScraping = await Promise.all(scrapePromises);
    this.scraped = resultsfromScraping.filter((source) => !source.error);
  }
  async cacheScrapedResults() {
    if (this.scraped.length > 0) {
      try {
        await cacheService.bulkSetSourceResults(this.keyword, this.scraped);
      } catch (error) {
        console.error("Error saving results to cache:", error);
      }
    }
  }
  getGroupedResultsBySources() {
    return [...this.cached, ...this.scraped];
  }
  getFlattenedResults() {
    return this.getGroupedResultsBySources()
      .map((source) => {
        source.data.forEach((item) => (item.source = source.source));
        return source.data;
      })
      .flat();
  }
  getFilteredResults() {
    let results = this.getFlattenedResults();
    if (this.minPrice !== undefined) {
      results = results.filter(
        (product) => product.price !== "Null" && product.price >= this.minPrice
      );
    }
    if (this.maxPrice !== undefined) {
      results = results.filter(
        (product) => product.price !== "Null" && product.price <= this.maxPrice
      );
    }
    if (this.sort === "asc") {
      results.sort((a, b) => {
        if (a.price === "Null") return 1;
        if (b.price === "Null") return -1;
        return a.price - b.price;
      });
    } else if (this.sort === "desc") {
      results.sort((a, b) => {
        if (a.price === "Null") return 1;
        if (b.price === "Null") return -1;
        return b.price - a.price;
      });
    }
    return results;
  }
}

// (async () => {
//   console.log("=== Starting scrape test ===");
//   // Initialize Redis connection and WAIT for it
//   await redisClient.connect();
//   const myScraper = new scrapeUtility(
//     "airpods",
//     "amazon,jumia",
//     (sort = "asc"),
//     (minPrice = 1000),
//     (maxPrice = 5000)
//   );
//   const startTime = Date.now();
//   const { cached, needsScraping } = await myScraper.getCachedResults();
//   // console.log("Cached sources:", cached);
//   // console.log("Sources needing scraping:", needsScraping);
//   await myScraper.scrapeMissingSources();
//   await myScraper.cacheScrapedResults();
//   const allResults = myScraper.getGroupedResultsBySources();
//   // console.log("All grouped results:", allResults);
//   // console.log("flatten", myScraper.getFlattenedResults());
//   console.log("filtered", myScraper.getFilteredResults());
//   console.log(
//     `=== Scrape test completed in ${(Date.now() - startTime) / 1000}s ===`
//   );

//   process.exit(0);
// })();

module.exports = scrapeUtility;
