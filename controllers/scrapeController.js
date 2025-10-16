const scrapeUtility = require("../scrapers/scrape.class");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Search = require("../models/searchModel");
exports.scrapeProducts = catchAsync(async (req, res, next) => {
  const { keyword, sources, sort, minPrice, maxPrice } = req.query;
  if (!keyword) {
    return next(new AppError("Keyword query parameter is required", 400));
  }
  const Scraper = new scrapeUtility(keyword, sources, sort, minPrice, maxPrice);
  await Scraper.getCachedResults();
  await Scraper.scrapeMissingSources();
  await Scraper.cacheScrapedResults();
  const results = Scraper.getFilteredResults();

  if (req.user && req.user.id) {
    const userId = req.user.id;
    await Search.create({
      keyword: Scraper.keyword,
      sources: Scraper.sources,
      sort: Scraper.sort,
      minPrice: Scraper.minPrice,
      maxPrice: Scraper.maxPrice,
      user: userId,
      results: results,
    });
  }

  res.status(200).json({
    status: "success",
    results: results.length,
    data: results,
  });
});
