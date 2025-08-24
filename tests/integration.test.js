const scrapers = require("../scrapers/scraper");

/**
 * Mock data generator for testing scrapers
 * Useful for testing the test infrastructure itself
 */
class MockScraperData {
  constructor() {
    this.rtxProducts = [
      {
        title: "NVIDIA GeForce RTX 4090 Gaming Graphics Card",
        price: "EGP 45,000",
        link: "https://example.com/rtx-4090",
        image: "https://example.com/images/rtx-4090.jpg",
        source: "mock",
      },
      {
        title: "RTX 4080 SUPER Graphics Card - 16GB GDDR6X",
        price: "EGP 35,000",
        link: "https://example.com/rtx-4080-super",
        image: "https://example.com/images/rtx-4080.jpg",
        source: "mock",
      },
      {
        title: "GeForce RTX 4070 Ti Gaming Edition",
        price: "EGP 25,000",
        link: "https://example.com/rtx-4070-ti",
        image: "https://example.com/images/rtx-4070-ti.jpg",
        source: "mock",
      },
    ];
  }

  /**
   * Generate mock products for testing
   */
  generateMockProducts(count = 5) {
    const products = [];

    for (let i = 0; i < count; i++) {
      const baseProduct = this.rtxProducts[i % this.rtxProducts.length];
      products.push({
        ...baseProduct,
        title: `${baseProduct.title} - Variant ${i + 1}`,
        price: `EGP ${(Math.random() * 50000 + 10000).toFixed(0)}`,
        link: `${baseProduct.link}?variant=${i + 1}`,
      });
    }

    return products;
  }
}

/**
 * Integration test for scraper functionality
 */
class ScraperIntegrationTest {
  constructor() {
    this.mockData = new MockScraperData();
    this.testResults = [];
  }

  /**
   * Test scraper response structure
   */
  async testScraperStructure() {
    console.log("🧪 Testing scraper response structure...");

    const scraperNames = Object.keys(scrapers);

    for (const name of scraperNames) {
      try {
        console.log(`  Testing ${name}...`);

        // Test with longer timeout to accommodate slower responses
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 60000)
        );

        const scrapePromise = scrapers[name]("RTX");
        const products = await Promise.race([scrapePromise, timeout]);

        // Check if it returns an array
        if (!Array.isArray(products)) {
          throw new Error("Scraper should return an array");
        }

        // Check product structure if products exist
        if (products.length > 0) {
          const sample = products[0];
          const requiredFields = ["title", "price", "link"];

          for (const field of requiredFields) {
            if (!(field in sample)) {
              throw new Error(`Missing required field: ${field}`);
            }
          }
        }

        console.log(
          `  ✅ ${name}: Structure valid (${products.length} products)`
        );
      } catch (error) {
        console.log(`  ❌ ${name}: ${error.message}`);
      }
    }
  }

  /**
   * Test scraper error handling
   */
  async testErrorHandling() {
    console.log("🔥 Testing error handling...");

    // Test with invalid keyword
    for (const [name, scraper] of Object.entries(scrapers)) {
      try {
        console.log(`  Testing ${name} with empty keyword...`);
        const products = await scraper("");
        console.log(
          `  ✅ ${name}: Handled empty keyword (${products.length} products)`
        );
      } catch (error) {
        console.log(
          `  ⚠️  ${name}: Error with empty keyword - ${error.message}`
        );
      }
    }
  }

  /**
   * Benchmark scraper performance
   */
  async benchmarkScrapers() {
    console.log("⚡ Benchmarking scraper performance...");

    const results = {};

    for (const [name, scraper] of Object.entries(scrapers)) {
      try {
        console.log(`  Benchmarking ${name}...`);

        const startTime = Date.now();
        const products = await scraper("RTX");
        const endTime = Date.now();

        results[name] = {
          duration: endTime - startTime,
          productCount: products.length,
          avgTimePerProduct:
            products.length > 0 ? (endTime - startTime) / products.length : 0,
        };

        console.log(
          `  ✅ ${name}: ${endTime - startTime}ms (${products.length} products)`
        );
      } catch (error) {
        console.log(`  ❌ ${name}: Failed - ${error.message}`);
        results[name] = { error: error.message };
      }
    }

    // Sort by performance
    console.log("\n📊 Performance Ranking:");
    const sortedResults = Object.entries(results)
      .filter(([_, result]) => !result.error)
      .sort(([_, a], [__, b]) => a.duration - b.duration);

    sortedResults.forEach(([name, result], index) => {
      console.log(
        `  ${index + 1}. ${name}: ${result.duration}ms (${
          result.productCount
        } products)`
      );
    });

    return results;
  }

  /**
   * Run all integration tests
   */
  async runAllTests() {
    console.log("🧪 Starting Integration Tests for Scrapers");
    console.log("==========================================");

    try {
      await this.testScraperStructure();
      console.log("");

      await this.testErrorHandling();
      console.log("");

      const benchmarkResults = await this.benchmarkScrapers();
      console.log("");

      console.log("✅ Integration tests completed");
      return benchmarkResults;
    } catch (error) {
      console.log(`❌ Integration tests failed: ${error.message}`);
      throw error;
    }
  }
}

// Sample test data for validation
const sampleTestCases = [
  {
    keyword: "RTX",
    expectedMinResults: 1,
    description: "Basic RTX search",
  },
  {
    keyword: "RTX 4090",
    expectedMinResults: 0,
    description: "Specific RTX 4090 search",
  },
  {
    keyword: "Graphics Card",
    expectedMinResults: 1,
    description: "Generic graphics card search",
  },
];

// Export for use in other test files
module.exports = {
  ScraperIntegrationTest,
  MockScraperData,
  sampleTestCases,
};

// Run if executed directly
if (require.main === module) {
  const integrationTest = new ScraperIntegrationTest();
  integrationTest
    .runAllTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
