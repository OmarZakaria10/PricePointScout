const scrapeSigma = require("./sigmaScraper");
const scrapeAmazon = require("./amazonScraper");
const scrapeElbadr = require("./elbadrScraper");
const scrapeJumia = require("./jumiaScraper");

module.exports = {
  sigma: scrapeSigma,
  amazon: scrapeAmazon,
  elbadr: scrapeElbadr,
  jumia: scrapeJumia,
};
