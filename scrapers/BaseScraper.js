const { getBrowser } = require("./browserInstance");

/**
 * Base scraper class that provides common functionality for e-commerce scrapers
 * Supports three pagination patterns:
 * 1. URL-based pagination (page number embedded in URL)
 * 2. Button-based pagination (clicking next button)
 * 3. Scroll-based pagination (infinite scroll)
 */
class BaseScraper {
  constructor(config) {
    this.name = config.name || "Unknown";
    this.baseUrl = config.baseUrl || "";
    this.searchUrl = config.searchUrl || "";
    this.maxPages = config.maxPages || 5;
    this.paginationType = config.paginationType || "url"; // 'url', 'button', 'scroll'
    this.selectors = config.selectors || {};
    this.userAgent =
      config.userAgent ||
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
    this.waitOptions = config.waitOptions || { waitUntil: "networkidle2" };
    this.scrollOptions = config.scrollOptions || { distance: 200, delay: 10 };
  }

  /**
   * Main scraping method
   * @param {string} keyword - Search keyword
   * @returns {Array} Array of product objects
   */
  async scrape(keyword) {
    const browser = await getBrowser();
    const page = await browser.newPage();
    const products = [];

    try {
      await page.setUserAgent(this.userAgent);

      // Initialize the search (can be overridden by child classes)
      await this.initializeSearch(page, keyword);

      switch (this.paginationType) {
        case "url":
          await this.scrapeWithUrlPagination(page, keyword, products);
          break;
        case "button":
          await this.scrapeWithButtonPagination(page, keyword, products);
          break;
        case "scroll":
          await this.scrapeWithScrollPagination(page, keyword, products);
          break;
        default:
          throw new Error(`Unknown pagination type: ${this.paginationType}`);
      }
    } catch (error) {
      console.error(`Error in ${this.name} scraper:`, error);
    } finally {
      await page.close();
    }

    return this.filterValidProducts(products);
  }

  /**
   * Initialize search - can be overridden by child classes
   * @param {Page} page - Puppeteer page instance
   * @param {string} keyword - Search keyword
   */
  async initializeSearch(page, keyword) {
    // Default implementation - child classes can override
    const url = this.buildSearchUrl(keyword, 1);
    await page.goto(url, this.waitOptions);
    // await page.goto(url);
  }

  /**
   * Scrape with URL-based pagination
   * @param {Page} page - Puppeteer page instance
   * @param {string} keyword - Search keyword
   * @param {Array} products - Products array to populate
   */
  async scrapeWithUrlPagination(page, keyword, products) {
    for (let pageNum = 1; pageNum <= this.maxPages; pageNum++) {
      try {
        const url = this.buildSearchUrl(keyword, pageNum);
        await page.goto(url, this.waitOptions);

        // Check if we've reached the end of results
        if (await this.isEndOfResults(page)) {
          break;
        }

        const pageProducts = await this.extractProductsFromPage(page);
        products.push(...pageProducts);

        if (pageProducts.length === 0) {
          break;
        }
      } catch (error) {
        console.error(`Error on page ${pageNum}:`, error);
      }
    }
  }

  /**
   * Scrape with button-based pagination
   * @param {Page} page - Puppeteer page instance
   * @param {string} keyword - Search keyword
   * @param {Array} products - Products array to populate
   */
  async scrapeWithButtonPagination(page, keyword, products) {
    let pageNum = 1;

    while (pageNum <= this.maxPages) {
      try {
        // Check if we've reached the end of results
        if (await this.isEndOfResults(page)) {
          break;
        }

        const pageProducts = await this.extractProductsFromPage(page);
        products.push(...pageProducts);

        if (pageProducts.length === 0) {
          break;
        }

        // Try to click next button
        const hasNextButton = await this.clickNextButton(page);
        if (!hasNextButton) {
          break;
        }

        pageNum++;

        // Wait for page to load
        await page.waitForTimeout(2000);
      } catch (error) {
        console.error(`Error on page ${pageNum}:`, error);
        break;
      }
    }
  }

  /**
   * Scrape with scroll-based pagination
   * @param {Page} page - Puppeteer page instance
   * @param {string} keyword - Search keyword
   * @param {Array} products - Products array to populate
   */
  async scrapeWithScrollPagination(page, keyword, products) {
    const url = this.buildSearchUrl(keyword, 1);
    await page.goto(url, this.waitOptions);

    let previousProductCount = 0;
    let scrollAttempts = 0;
    const maxScrollAttempts = this.maxPages * 3; // Allow more scroll attempts

    while (scrollAttempts < maxScrollAttempts) {
      try {
        // Extract current products
        const currentProducts = await this.extractProductsFromPage(page);

        if (currentProducts.length === previousProductCount) {
          // No new products loaded, we might have reached the end
          scrollAttempts++;
        } else {
          // New products found, reset scroll attempts
          scrollAttempts = 0;
          previousProductCount = currentProducts.length;

          // Update products array (remove duplicates)
          products.length = 0; // Clear existing products
          products.push(...currentProducts);
        }

        // Perform scroll
        await this.performScroll(page);

        // Wait for potential new content to load
        await page.waitForTimeout(this.scrollOptions.delay * 100);
      } catch (error) {
        console.error(`Error during scroll attempt ${scrollAttempts}:`, error);
        scrollAttempts++;
      }
    }
  }

  /**
   * Build search URL for the given keyword and page number
   * @param {string} keyword - Search keyword
   * @param {number} pageNum - Page number
   * @returns {string} Complete search URL
   */
  buildSearchUrl(keyword, pageNum) {
    const encodedKeyword = encodeURIComponent(keyword.trim());
    return this.searchUrl
      .replace("{keyword}", encodedKeyword)
      .replace("{page}", pageNum);
  }

  /**
   * Extract products from current page - must be implemented by child classes
   * @param {Page} page - Puppeteer page instance
   * @returns {Array} Array of products from current page
   */
  async extractProductsFromPage(page) {
    const products = [];

    try {
      const productHandles = await page.$$(this.selectors.productContainer);

      for (const handle of productHandles) {
        const product = await this.extractSingleProduct(page, handle);
        if (product && this.isValidProduct(product)) {
          products.push(product);
        }
      }
    } catch (error) {
      console.error("Error extracting products from page:", error);
    }

    return products;
  }

  /**
   * Extract single product data from product element
   * @param {Page} page - Puppeteer page instance
   * @param {ElementHandle} handle - Product element handle
   * @returns {Object} Product object
   */
  async extractSingleProduct(page, handle) {
    const product = {
      title: "Null",
      price: "Null",
      link: "Null",
      img: "Null",
    };

    try {
      // Extract title
      if (this.selectors.title) {
        product.title = await page.evaluate(
          (el, selector) => {
            const element = el.querySelector(selector);
            return element ? element.textContent.trim() : "Null";
          },
          handle,
          this.selectors.title
        );
      }

      // Extract price
      if (this.selectors.price) {
        product.price = await page.evaluate(
          (el, selector) => {
            const element = el.querySelector(selector);
            return element ? element.textContent.trim() : "Null";
          },
          handle,
          this.selectors.price
        );
      }

      // Extract link
      if (this.selectors.link) {
        product.link = await page.evaluate(
          (el, selector) => {
            const element = el.querySelector(selector);
            return element ? element.getAttribute("href") : "Null";
          },
          handle,
          this.selectors.link
        );

        // Make link absolute if needed
        if (product.link !== "Null" && !product.link.startsWith("http")) {
          product.link = this.baseUrl + product.link;
        }
      }

      // Extract image
      if (this.selectors.image) {
        product.img = await page.evaluate(
          (el, selector) => {
            const element = el.querySelector(selector);
            if (!element) return "Null";

            // Try different image attributes
            return (
              element.getAttribute("src") ||
              element.getAttribute("data-src") ||
              element.getAttribute("srcset")?.split(" ")[0] ||
              "Null"
            );
          },
          handle,
          this.selectors.image
        );

        // Make image URL absolute if needed
        if (product.img !== "Null" && product.img.startsWith("//")) {
          product.img = "https:" + product.img;
        } else if (product.img !== "Null" && !product.img.startsWith("http")) {
          product.img = this.baseUrl + product.img;
        }
      }
    } catch (error) {
      console.error("Error extracting single product:", error);
    }

    return product;
  }

  /**
   * Check if product is valid
   * @param {Object} product - Product object
   * @returns {boolean} True if product is valid
   */
  isValidProduct(product) {
    return product.title !== "Null" && product.price !== "Null";
  }

  /**
   * Filter out invalid products
   * @param {Array} products - Array of products
   * @returns {Array} Filtered array of valid products
   */
  filterValidProducts(products) {
    return products.filter(this.isValidProduct);
  }

  /**
   * Check if we've reached the end of results
   * @param {Page} page - Puppeteer page instance
   * @returns {boolean} True if end of results reached
   */
  async isEndOfResults(page) {
    if (!this.selectors.endOfResults) {
      return false;
    }

    try {
      const endElement = await page.$(this.selectors.endOfResults);
      return !!endElement;
    } catch (error) {
      return false;
    }
  }

  /**
   * Click next button for button-based pagination
   * @param {Page} page - Puppeteer page instance
   * @returns {boolean} True if next button was clicked successfully
   */
  async clickNextButton(page) {
    if (!this.selectors.nextButton) {
      return false;
    }

    try {
      const nextButton = await page.$(this.selectors.nextButton);
      if (nextButton) {
        await nextButton.click();
        return true;
      }
    } catch (error) {
      console.error("Error clicking next button:", error);
    }

    return false;
  }

  /**
   * Perform scroll action for scroll-based pagination
   * @param {Page} page - Puppeteer page instance
   */
  async performScroll(page) {
    await page.evaluate((options) => {
      return new Promise((resolve) => {
        let totalHeight = 0;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, options.distance);
          totalHeight += options.distance;

          if (totalHeight >= scrollHeight - window.innerHeight) {
            clearInterval(timer);
            resolve();
          }
        }, options.delay);
      });
    }, this.scrollOptions);
  }

  /**
   * Handle cookie popups or other modals - can be overridden by child classes
   * @param {Page} page - Puppeteer page instance
   */
  async handlePopups(page) {
    // Default implementation - can be overridden by child classes
    // Try to close common cookie popups
    const commonPopupSelectors = [
      ".cookie-banner button",
      ".cookie-consent button",
      "#cookie-consent button",
      ".cls",
      "[data-testid='cookie-banner'] button",
    ];

    for (const selector of commonPopupSelectors) {
      try {
        const popup = await page.$(selector);
        if (popup) {
          await popup.click();
          await page.waitForTimeout(1000);
          break;
        }
      } catch (error) {
        // Ignore popup errors
      }
    }
  }
}

module.exports = BaseScraper;
