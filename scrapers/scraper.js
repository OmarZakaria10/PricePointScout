// const scrapeSigma = require("./sigmaScraper");
const scrapeAmazon = require("./amazonScraper");
const scrapeBtech = require("./btechScraper");
const scrapeElbadr = require("./elbadrScraper");
const scrapeJumia = require("./jumiaScraper");
// const scrapeCompuMart = require("./compuMartScraper");
// const scrapeNoon = require("./noonScraper");
const scrapeTwoB = require("./twoBScraper");

module.exports = {
  //   sigma: scrapeSigma,
  amazon: scrapeAmazon,
  elbadr: scrapeElbadr,
  jumia: scrapeJumia,
  // compumart: scrapeCompuMart,
  // noon: scrapeNoon,
  "2B": scrapeTwoB,
  btech: scrapeBtech,
};
