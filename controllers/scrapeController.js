const scrapers = require("../scrapers/scraper");
const catchAsync = require("../utils/catchAsync");
const Search = require("../models/searchModel");
const searchController = require("../controllers/searchController");
const cacheService = require("../utils/cacheService");

let validResults = [];
exports.scrapeProducts = catchAsync(async (req, res) => {
  try {
    const { keyword, sources, sort, minPrice, maxPrice } = req.query;
    if (!keyword) {
      return res
        .status(400)
        .json({ error: 'Missing "keyword" query parameter' });
    }

    // If user doesn't specify sources, default to ALL
    let sourceArray = [];
    if (!sources) {
      sourceArray = Object.keys(scrapers);
    } else {
      // sources=sigma,amazon => ["sigma","amazon"]
      sourceArray = sources.split(",").map((s) => s.trim().toLowerCase());
      // filter out anything that isn't in our 'scrapers' object
      sourceArray = sourceArray.filter((s) => scrapers[s]);
    }

    const { cached, needsScraping } = await cacheService.getSourceResults(
      keyword,
      sourceArray
    );
    // console.log(needsScraping);

    if (needsScraping.length > 0) {
      try {
        const promises = needsScraping.map(async (source) => {
          try {
            const result = await scrapers[source](keyword);
            return {
              source,
              data: result,
            };
          } catch (err) {
            console.error(`Error scraping ${source}:`, err);
            return { source, data: [], error: true };
          }
        });
        const results = await Promise.all(promises);
        validResults = results.filter((r) => !r.error);
        console.log(validResults);
        await cacheService.bulkSetSourceResults(keyword, validResults);
      } catch (err) {
        console.error("Error saving results to cache:", err);
      }
    }
    // console.log(cached);
    // cached = JSON.parse(cached);
    // Combine cached and scraped results into a single array
    const allResults = [...cached, ...validResults];
    // console.log(allResults);

    let flatResults = allResults.map((r) => r.data).flat();
    // console.log(flatResults);

    // Filter by price range
    if (minPrice && !isNaN(minPrice) && maxPrice && !isNaN(maxPrice)) {
      flatResults = flatResults.filter(
        (product) =>
          parsePrice(product.price) >= minPrice &&
          parsePrice(product.price) <= maxPrice
      );
    }
    // Sort by price in which order
    if (sort) {
      if (sort === "des") {
        flatResults = flatResults.sort(
          (a, b) => parsePrice(b.price) - parsePrice(a.price)
        );
      } else if (sort === "asc" || !sort) {
        flatResults = flatResults.sort(
          (a, b) => parsePrice(a.price) - parsePrice(b.price)
        );
      }
    }

    if (req.user) {
      const userId = req.user.id;
      const newSearch = await Search.create({
        keyword,
        sources: sourceArray,
        sort,
        minPrice,
        maxPrice,
        user: userId,
        results: flatResults,
      });
    }
    return res.status(200).json(flatResults);

    // Helper function to parse price strings to numbers (or 0 if something goes wrong)
    function parsePrice(str) {
      // Remove everything except digits and decimal points
      const numeric = str.replace(/[^\d.]/g, "");
      // Convert to a number (or 0 if something goes wrong)
      return parseFloat(numeric) || 0;
    }

    // return res.status(200).json(results);
  } catch (error) {
    console.error("Error in scrapeMultipleSources:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
