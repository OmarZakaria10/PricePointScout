const scrapeSigma = require("./sigmaScraper");
const scrapeAmazon = require("./amazonScraper");
const scrapeElbadr = require("./elbadrScraper");
const scrapeJumia = require("./jumiaScraper");
const scrapeCompuMart = require("./compuMartScraper");

module.exports = {
  sigma: scrapeSigma,
  amazon: scrapeAmazon,
  elbadr: scrapeElbadr,
  jumia: scrapeJumia,
  compuMart: scrapeCompuMart
};
