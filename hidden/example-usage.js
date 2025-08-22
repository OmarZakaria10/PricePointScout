/**
 * Example usage of the new modular scrapers
 * This file demonstrates different ways to use the refactored scraper system
 */

// Import the refactored scrapers
const { registry } = require("./scraper.refactored");

async function demonstrateScrapers() {
  const keyword = "RTX 4060";

  console.log("=== Modular Scrapers Demo ===\n");

  // 1. Get scraper statistics
  console.log("1. Scraper Statistics:");
  console.log(registry.getStats());
  console.log("\n");

  // 2. Run a single scraper
  console.log("2. Running Amazon scraper:");
  try {
    const amazonProducts = await registry.run("amazon", keyword);
    console.log(`Found ${amazonProducts.length} products from Amazon`);
    if (amazonProducts.length > 0) {
      console.log("Sample product:", {
        title: amazonProducts[0].title,
        price: amazonProducts[0].price,
        link: amazonProducts[0].link.substring(0, 50) + "...",
      });
    }
  } catch (error) {
    console.error("Amazon scraper failed:", error.message);
  }
  console.log("\n");

  // 3. Run multiple scrapers concurrently
  console.log("3. Running multiple scrapers (Amazon & Jumia):");
  try {
    const results = await registry.runMultiple(["amazon", "jumia"], keyword);
    Object.entries(results).forEach(([name, result]) => {
      if (result.success) {
        console.log(`${name}: ${result.results.length} products found`);
      } else {
        console.log(`${name}: Failed - ${result.error}`);
      }
    });
  } catch (error) {
    console.error("Multiple scrapers failed:", error.message);
  }
  console.log("\n");

  // 4. Get scrapers by pagination type
  console.log("4. Scrapers by pagination type:");
  const urlScrapers = registry.getByPaginationType("url");
  const buttonScrapers = registry.getByPaginationType("button");
  const scrollScrapers = registry.getByPaginationType("scroll");

  console.log(
    `URL-based scrapers: ${urlScrapers.map((s) => s.name).join(", ")}`
  );
  console.log(
    `Button-based scrapers: ${buttonScrapers.map((s) => s.name).join(", ")}`
  );
  console.log(
    `Scroll-based scrapers: ${scrollScrapers.map((s) => s.name).join(", ")}`
  );
  console.log("\n");

  // 5. Demonstrate error handling
  console.log("5. Error handling example (non-existent scraper):");
  try {
    await registry.run("non-existent-scraper", keyword);
  } catch (error) {
    console.log("Expected error caught:", error.message);
  }
  console.log("\n");

  console.log("=== Demo Complete ===");
}

// Example of using individual scrapers (backward compatibility)
async function backwardCompatibilityExample() {
  console.log("\n=== Backward Compatibility Example ===\n");

  // Import individual scrapers the old way
  const scrapers = require("./scraper.refactored");

  console.log("Running Sigma scraper using old interface:");
  try {
    const products = await scrapers.sigma("SSD");
    console.log(`Found ${products.length} products from Sigma`);
  } catch (error) {
    console.error("Sigma scraper failed:", error.message);
  }
}

// Example of creating a custom scraper test
async function customScraperTest() {
  console.log("\n=== Custom Scraper Test ===\n");

  // Test each pagination type
  const paginationTests = [
    { type: "url", scrapers: ["amazon", "jumia"] },
    { type: "button", scrapers: ["noon"] },
    { type: "scroll", scrapers: ["compumart"] },
  ];

  for (const test of paginationTests) {
    console.log(`Testing ${test.type}-based pagination:`);

    for (const scraperName of test.scrapers) {
      try {
        const startTime = Date.now();
        const products = await registry.run(scraperName, "laptop");
        const duration = Date.now() - startTime;

        console.log(
          `  ${scraperName}: ${products.length} products in ${duration}ms`
        );
      } catch (error) {
        console.log(`  ${scraperName}: FAILED - ${error.message}`);
      }
    }
    console.log("");
  }
}

// Run the demonstrations
if (require.main === module) {
  (async () => {
    try {
      await demonstrateScrapers();
      await backwardCompatibilityExample();
      await customScraperTest();
    } catch (error) {
      console.error("Demo failed:", error);
    }
  })();
}

module.exports = {
  demonstrateScrapers,
  backwardCompatibilityExample,
  customScraperTest,
};
