const scrapers = require("../scrapers/scraper");

exports.scrapeMultipleSources = async (req, res) => {
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

    // Build array of scraper promises
    // Each selected site calls its respective scraper function
    const promises = sourceArray.map((source) => scrapers[source](keyword));

    // Run them all in parallel
    const results = await Promise.all(promises);
    let flatResults = results.flat();
    const finalData = {};

    if (!sort && !minPrice && !maxPrice) {
      // Combine results into an object keyed by source name
      sourceArray.forEach((source, idx) => {
        finalData[source] = results[idx];
        // return res.status(200).json(finalData);
      });
    }

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
      } else if (sort === "asc") {
        flatResults = flatResults.sort(
          (a, b) => parsePrice(a.price) - parsePrice(b.price)
        );
      }
    }
    return res
      .status(200)
      .json(Object.keys(finalData).length > 0 ? finalData : flatResults);

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
};
