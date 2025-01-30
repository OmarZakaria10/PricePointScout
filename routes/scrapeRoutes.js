// src/routes/scraperRoutes.js
const express = require("express");
const router = express.Router();

const { scrapeMultipleSources } = require("../controllers/scrapeController");

// Example: GET /scrape/multiple?keyword=ssd&sources=sigma,amazon
//          GET /scrape/multiple?keyword=ssd          (scrapes ALL sources)
router.get("/multiple", scrapeMultipleSources);

module.exports = router;
