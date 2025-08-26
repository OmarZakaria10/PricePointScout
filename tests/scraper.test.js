const scrapers = require("../scrapers/scraper");
const { getBrowser } = require("../scrapers/browserInstance");

/**
 * Comprehensive test suite for scrapers with RTX keyword
 * Tests functionality, performance, and data quality
 */
class ScraperTestSuite {
  constructor() {
    this.testKeyword = "RTX";
    this.timeout = 180000; // 3 minute timeout per test
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      details: [],
      startTime: new Date(),
      endTime: null,
    };
  }

  /**
   * Log test results
   */
  log(message, level = "INFO") {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  /**
   * Validate product structure
   */
  validateProduct(product) {
    const errors = [];

    if (!product.title || typeof product.title !== "string") {
      errors.push("Missing or invalid title");
    }

    if (!product.price || typeof product.price !== "string") {
      errors.push("Missing or invalid price");
    }

    if (!product.link || typeof product.link !== "string") {
      errors.push("Missing or invalid link");
    }

    if (product.image && typeof product.image !== "string") {
      errors.push("Invalid image URL");
    }

    return errors;
  }

  /**
   * Check if product is RTX-related
   */
  isRTXRelated(product) {
    const title = product.title.toLowerCase();
    const rtxKeywords = ["rtx", "geforce rtx", "nvidia rtx", "graphics card"];
    return rtxKeywords.some((keyword) => title.includes(keyword));
  }

  /**
   * Test individual scraper
   */
  async testScraper(scraperName, scraperFunction) {
    this.log(`Testing ${scraperName} scraper...`);
    const testResult = {
      scraper: scraperName,
      success: false,
      error: null,
      products: 0,
      rtxRelevant: 0,
      validProducts: 0,
      executionTime: 0,
      issues: [],
    };

    try {
      const startTime = Date.now();

      // Set timeout for scraping
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Scraper timeout")), this.timeout);
      });

      const scrapePromise = scraperFunction(this.testKeyword);
      const products = await Promise.race([scrapePromise, timeoutPromise]);

      const endTime = Date.now();
      testResult.executionTime = endTime - startTime;

      if (!Array.isArray(products)) {
        throw new Error("Scraper did not return an array");
      }

      testResult.products = products.length;

      // Validate each product
      for (const product of products) {
        const validationErrors = this.validateProduct(product);
        if (validationErrors.length === 0) {
          testResult.validProducts++;
        } else {
          testResult.issues.push(
            `Product validation: ${validationErrors.join(", ")}`
          );
        }

        if (this.isRTXRelated(product)) {
          testResult.rtxRelevant++;
        }
      }

      // Test success criteria
      if (products.length === 0) {
        testResult.issues.push("No products returned");
      }

      if (testResult.rtxRelevant === 0 && products.length > 0) {
        testResult.issues.push("No RTX-related products found");
      }

      if (testResult.validProducts / products.length < 0.8) {
        testResult.issues.push(
          "Less than 80% of products have valid structure"
        );
      }

      testResult.success = testResult.issues.length === 0;

      this.log(
        `${scraperName}: ${products.length} products, ${testResult.rtxRelevant} RTX-related, ${testResult.executionTime}ms`
      );
    } catch (error) {
      testResult.error = error.message;
      testResult.success = false;
      this.log(`${scraperName} failed: ${error.message}`, "ERROR");
    }

    return testResult;
  }

  /**
   * Test browser instance
   */
  async testBrowserInstance() {
    this.log("Testing browser instance...");
    try {
      const browser = await getBrowser();
      if (!browser) {
        throw new Error("Browser instance is null");
      }

      const page = await browser.newPage();
      await page.goto("https://www.google.com", { waitUntil: "networkidle2" });
      await page.close();

      this.log("Browser instance test passed");
      return true;
    } catch (error) {
      this.log(`Browser instance test failed: ${error.message}`, "ERROR");
      return false;
    }
  }

  /**
   * Run all scraper tests
   */
  async runAllTests() {
    this.log("Starting scraper test suite...");
    this.results.startTime = new Date();

    // Test browser first
    const browserTest = await this.testBrowserInstance();
    if (!browserTest) {
      this.log("Browser test failed, aborting scraper tests", "ERROR");
      process.exit(1);
    }

    // Test each scraper
    const scraperTests = Object.entries(scrapers);

    for (const [name, scraperFunction] of scraperTests) {
      this.results.total++;
      const result = await this.testScraper(name, scraperFunction);
      this.results.details.push(result);

      if (result.success) {
        this.results.passed++;
      } else {
        this.results.failed++;
      }

      // Add delay between tests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    this.results.endTime = new Date();
    this.generateReport();
  }

  /**
   * Generate test report
   */
  generateReport() {
    const duration = this.results.endTime - this.results.startTime;

    this.log("=".repeat(60));
    this.log("SCRAPER TEST SUITE RESULTS");
    this.log("=".repeat(60));
    this.log(`Test Duration: ${Math.round(duration / 1000)}s`);
    this.log(`Total Tests: ${this.results.total}`);
    this.log(`Passed: ${this.results.passed}`);
    this.log(`Failed: ${this.results.failed}`);
    this.log(
      `Success Rate: ${Math.round(
        (this.results.passed / this.results.total) * 100
      )}%`
    );

    this.log("\nDETAILED RESULTS:");
    this.log("-".repeat(60));

    for (const result of this.results.details) {
      const status = result.success ? "✓ PASS" : "✗ FAIL";
      this.log(`${status} ${result.scraper.toUpperCase()}`);
      this.log(`  Products: ${result.products}`);
      this.log(`  RTX Relevant: ${result.rtxRelevant}`);
      this.log(`  Valid Products: ${result.validProducts}`);
      this.log(`  Execution Time: ${result.executionTime}ms`);

      if (result.error) {
        this.log(`  Error: ${result.error}`, "ERROR");
      }

      if (result.issues.length > 0) {
        this.log(`  Issues: ${result.issues.join(", ")}`, "WARN");
      }

      this.log("");
    }

    // Exit with appropriate code for Jenkins
    if (this.results.failed > 0) {
      this.log("Some tests failed. Exiting with code 1.", "ERROR");
      process.exit(1);
    } else {
      this.log("All tests passed! Exiting with code 0.", "INFO");
      process.exit(0);
    }
  }

  /**
   * Test performance benchmarks
   */
  async runPerformanceTests() {
    this.log("Running performance benchmark tests...");

    const performanceResults = [];

    for (const [name, scraperFunction] of Object.entries(scrapers)) {
      try {
        const iterations = 3;
        const times = [];

        for (let i = 0; i < iterations; i++) {
          const start = Date.now();
          await scraperFunction(this.testKeyword);
          const end = Date.now();
          times.push(end - start);

          // Wait between iterations
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }

        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);

        performanceResults.push({
          scraper: name,
          avgTime,
          minTime,
          maxTime,
          times,
        });
      } catch (error) {
        this.log(
          `Performance test failed for ${name}: ${error.message}`,
          "ERROR"
        );
      }
    }

    this.log("\nPERFORMACE RESULTS:");
    this.log("-".repeat(60));

    for (const result of performanceResults) {
      this.log(`${result.scraper.toUpperCase()}:`);
      this.log(`  Average: ${Math.round(result.avgTime)}ms`);
      this.log(`  Min: ${result.minTime}ms`);
      this.log(`  Max: ${result.maxTime}ms`);
      this.log("");
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const testSuite = new ScraperTestSuite();

  // Handle command line arguments
  const args = process.argv.slice(2);

  if (args.includes("--performance")) {
    testSuite.runPerformanceTests();
  } else {
    testSuite.runAllTests();
  }
}

module.exports = ScraperTestSuite;
