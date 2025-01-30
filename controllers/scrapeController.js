// src/controllers/scraperController.js
const scrapers = require("../scrapers/scraper"); 
// scrapers = { sigma: scrapeSigma, amazon: scrapeAmazon, google: scrapeGoogle, yahoo: scrapeYahoo }

exports.scrapeMultipleSources = async (req, res) => {
  try {
    const { keyword, sources } = req.query;
    if (!keyword) {
      return res.status(400).json({ error: 'Missing "keyword" query parameter' });
    }

    // If user doesn't specify sources, default to ALL
    let sourceArray = [];
    if (!sources) {
      sourceArray = Object.keys(scrapers);
      // e.g. ["sigma", "amazon", "google", "yahoo"]
    } else {
      // sources=sigma,amazon => ["sigma","amazon"]
      sourceArray = sources.split(",").map((s) => s.trim().toLowerCase());
      // filter out anything that isn't in our 'scrapers' object
      sourceArray = sourceArray.filter((s) => scrapers[s]);
    }

    // Build array of scraper promises
    // Each selected site calls its respective scraper function
    const promises = sourceArray.map((source) => scrapers[source](keyword));

    // Run them all in parallel
    const results = await Promise.all(promises);

    // Combine results into an object keyed by source name
    const finalData = {};
    sourceArray.forEach((source, idx) => {
      finalData[source] = results[idx];
    });
    function parsePrice(str) {
      // Remove everything except digits and decimal points
      const numeric = str.replace(/[^\d.]/g, "");
      // Convert to a number (or 0 if something goes wrong)
      return parseFloat(numeric) || 0;
    }

    return res.status(200).json(results.flat().sort((a, b) => parsePrice(a.price) - parsePrice(b.price)));
  } catch (error) {
    console.error("Error in scrapeMultipleSources:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
