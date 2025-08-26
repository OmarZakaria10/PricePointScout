const ScraperTestSuite = require("./scraper.test");

/**
 * Simplified test runner for quick validation
 * Tests each scraper with RTX keyword and validates basic functionality
 */
async function quickTest() {
  console.log("🚀 Quick Scraper Test for RTX keyword");
  console.log("=====================================");

  const scrapers = require("../scrapers/scraper");
  const startTime = Date.now();

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    scrapers: {},
  };

  for (const [name, scraperFunction] of Object.entries(scrapers)) {
    results.total++;
    console.log(`\n🔍 Testing ${name.toUpperCase()} scraper...`);

    try {
      // Set 90 second timeout for quick test
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 90000)
      );

      const scrapePromise = scraperFunction("RTX");
      const products = await Promise.race([scrapePromise, timeout]);

      if (Array.isArray(products) && products.length > 0) {
        console.log(`✅ SUCCESS: Found ${products.length} products`);

        // Show sample products
        const sampleSize = Math.min(3, products.length);
        console.log(`   Sample products (${sampleSize}):`);

        for (let i = 0; i < sampleSize; i++) {
          const product = products[i];
          console.log(`   ${i + 1}. ${product.title?.substring(0, 50)}...`);
          console.log(`      Price: ${product.price}`);
        }

        results.passed++;
        results.scrapers[name] = { status: "passed", count: products.length };
      } else {
        console.log("⚠️  WARNING: No products found");
        results.scrapers[name] = { status: "warning", count: 0 };
      }
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}`);
      results.failed++;
      results.scrapers[name] = { status: "failed", error: error.message };
    }
  }

  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);

  console.log("\n" + "=".repeat(50));
  console.log("📊 QUICK TEST SUMMARY");
  console.log("=".repeat(50));
  console.log(`⏱️  Duration: ${duration}s`);
  console.log(
    `📈 Total: ${results.total} | ✅ Passed: ${results.passed} | ❌ Failed: ${results.failed}`
  );
  console.log(
    `📊 Success Rate: ${Math.round((results.passed / results.total) * 100)}%`
  );

  // Return appropriate exit code
  return results.failed === 0 ? 0 : 1;
}

/**
 * Test individual scraper
 */
async function testScraper(scraperName, keyword = "RTX") {
  console.log(`🎯 Testing ${scraperName} with keyword: ${keyword}`);

  const scrapers = require("../scrapers/scraper");
  const scraperFunction = scrapers[scraperName.toLowerCase()];

  if (!scraperFunction) {
    console.log(`❌ Scraper '${scraperName}' not found`);
    console.log(`Available scrapers: ${Object.keys(scrapers).join(", ")}`);
    return 1;
  }

  try {
    const startTime = Date.now();
    const products = await scraperFunction(keyword);
    const endTime = Date.now();

    console.log(
      `✅ Success! Found ${products.length} products in ${
        endTime - startTime
      }ms`
    );

    if (products.length > 0) {
      console.log("\n📦 Products found:");
      products.slice(0, 5).forEach((product, index) => {
        console.log(`${index + 1}. ${product.title}`);
        console.log(`   💰 ${product.price}`);
        console.log(`   🔗 ${product.link}`);
        console.log("");
      });

      if (products.length > 5) {
        console.log(`... and ${products.length - 5} more products`);
      }
    }

    return 0;
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    return 1;
  }
}

// Handle command line execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Run quick test for all scrapers
    quickTest().then((code) => process.exit(code));
  } else if (args[0] === "--full") {
    // Run full test suite
    const testSuite = new ScraperTestSuite();
    testSuite.runAllTests();
  } else if (args[0] === "--scraper") {
    // Test specific scraper
    if (args[1]) {
      const keyword = args[2] || "RTX";
      testScraper(args[1], keyword).then((code) => process.exit(code));
    } else {
      console.log("Usage: node quick-test.js --scraper <name> [keyword]");
      process.exit(1);
    }
  } else {
    console.log("Usage:");
    console.log(
      "  node quick-test.js              # Run quick test for all scrapers"
    );
    console.log("  node quick-test.js --full       # Run full test suite");
    console.log(
      "  node quick-test.js --scraper <name> [keyword]  # Test specific scraper"
    );
    process.exit(1);
  }
}

module.exports = { quickTest, testScraper };
