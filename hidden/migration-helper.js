/**
 * Migration script to help transition from old scrapers to new modular ones
 * This script can be used to test the new scrapers and ensure compatibility
 */

const fs = require("fs");
const path = require("path");

// Import both old and new scrapers for comparison
const oldScrapers = require("./scraper");
const { registry } = require("./scraper.refactored");

/**
 * Compare results from old and new scrapers
 * @param {string} scraperName - Name of scraper to test
 * @param {string} keyword - Search keyword
 */
async function compareScrapers(scraperName, keyword) {
  console.log(`\n=== Comparing ${scraperName} scrapers ===`);

  let oldResults = [];
  let newResults = [];

  // Test old scraper
  try {
    console.log("Testing old scraper...");
    const startTime = Date.now();
    oldResults = await oldScrapers[scraperName](keyword);
    const oldDuration = Date.now() - startTime;
    console.log(
      `Old scraper: ${oldResults.length} products in ${oldDuration}ms`
    );
  } catch (error) {
    console.error("Old scraper failed:", error.message);
  }

  // Test new scraper
  try {
    console.log("Testing new scraper...");
    const startTime = Date.now();
    newResults = await registry.run(scraperName, keyword);
    const newDuration = Date.now() - startTime;
    console.log(
      `New scraper: ${newResults.length} products in ${newDuration}ms`
    );
  } catch (error) {
    console.error("New scraper failed:", error.message);
  }

  // Compare results
  if (oldResults.length > 0 && newResults.length > 0) {
    console.log("\nComparison:");
    console.log(
      `Product count difference: ${newResults.length - oldResults.length}`
    );

    // Compare first product structure
    if (oldResults[0] && newResults[0]) {
      const oldKeys = Object.keys(oldResults[0]).sort();
      const newKeys = Object.keys(newResults[0]).sort();

      console.log("Old product structure:", oldKeys);
      console.log("New product structure:", newKeys);
      console.log(
        "Structure matches:",
        JSON.stringify(oldKeys) === JSON.stringify(newKeys)
      );
    }
  }

  return { old: oldResults, new: newResults };
}

/**
 * Test all scrapers and generate a migration report
 */
async function generateMigrationReport() {
  const report = {
    timestamp: new Date().toISOString(),
    testKeyword: "RTX 4060",
    results: {},
  };

  const scraperNames = ["amazon", "jumia", "sigma", "elbadr"]; // Start with working ones

  console.log("Generating migration report...\n");

  for (const scraperName of scraperNames) {
    console.log(`Testing ${scraperName}...`);

    try {
      const comparison = await compareScrapers(scraperName, report.testKeyword);

      report.results[scraperName] = {
        oldCount: comparison.old.length,
        newCount: comparison.new.length,
        success: true,
        compatible: comparison.old.length > 0 && comparison.new.length > 0,
      };
    } catch (error) {
      report.results[scraperName] = {
        oldCount: 0,
        newCount: 0,
        success: false,
        error: error.message,
      };
    }
  }

  // Save report
  const reportPath = path.join(__dirname, "migration-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log("\n=== Migration Report ===");
  console.log(JSON.stringify(report, null, 2));
  console.log(`\nReport saved to: ${reportPath}`);

  return report;
}

/**
 * Update the main scraper.js file to use new scrapers
 */
async function updateMainScraperFile() {
  const newContent = `// Updated scraper file - uses modular scrapers
// This maintains backward compatibility while using the new architecture

const { registry } = require('./scraper.refactored');

// Export individual scrapers for backward compatibility
module.exports = {
  sigma: async (keyword) => registry.run('sigma', keyword),
  amazon: async (keyword) => registry.run('amazon', keyword),
  elbadr: async (keyword) => registry.run('elbadr', keyword),
  jumia: async (keyword) => registry.run('jumia', keyword),
  compumart: async (keyword) => registry.run('compumart', keyword),
  noon: async (keyword) => registry.run('noon', keyword),
  
  // New registry interface
  registry
};
`;

  const backupPath = path.join(__dirname, "scraper.js.backup");
  const mainPath = path.join(__dirname, "scraper.js");

  // Create backup
  if (fs.existsSync(mainPath)) {
    fs.copyFileSync(mainPath, backupPath);
    console.log(`Backup created: ${backupPath}`);
  }

  // Write new content
  fs.writeFileSync(mainPath, newContent);
  console.log(`Updated: ${mainPath}`);
  console.log("Main scraper file updated with new modular architecture");
}

/**
 * Validate that all scrapers are working
 */
async function validateAllScrapers() {
  console.log("\n=== Validating All Scrapers ===\n");

  const scrapers = registry.getNames();
  const results = {};

  for (const scraperName of scrapers) {
    console.log(`Validating ${scraperName}...`);

    try {
      const products = await registry.run(scraperName, "test");
      results[scraperName] = {
        success: true,
        productCount: products.length,
        hasValidProducts: products.some(
          (p) => p.title !== "Null" && p.price !== "Null"
        ),
      };
      console.log(`✓ ${scraperName}: ${products.length} products`);
    } catch (error) {
      results[scraperName] = {
        success: false,
        error: error.message,
      };
      console.log(`✗ ${scraperName}: ${error.message}`);
    }
  }

  console.log("\n=== Validation Summary ===");
  const successful = Object.values(results).filter((r) => r.success).length;
  const total = Object.keys(results).length;
  console.log(`${successful}/${total} scrapers working correctly`);

  return results;
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const scraper = process.argv[3];
  const keyword = process.argv[4] || "RTX 4060";

  switch (command) {
    case "compare":
      if (!scraper) {
        console.error(
          "Usage: node migration-helper.js compare <scraper-name> [keyword]"
        );
        process.exit(1);
      }
      compareScrapers(scraper, keyword);
      break;

    case "report":
      generateMigrationReport();
      break;

    case "update":
      updateMainScraperFile();
      break;

    case "validate":
      validateAllScrapers();
      break;

    default:
      console.log("Migration Helper Commands:");
      console.log("  compare <scraper> [keyword] - Compare old vs new scraper");
      console.log("  report - Generate full migration report");
      console.log("  update - Update main scraper.js file");
      console.log("  validate - Validate all scrapers are working");
      console.log("");
      console.log("Examples:");
      console.log("  node migration-helper.js compare amazon");
      console.log("  node migration-helper.js report");
      console.log("  node migration-helper.js validate");
  }
}

module.exports = {
  compareScrapers,
  generateMigrationReport,
  updateMainScraperFile,
  validateAllScrapers,
};
