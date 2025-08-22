const BaseScraper = require("./BaseScraper");

class JumiaScraper extends BaseScraper {
  constructor() {
    const config = {
      name: "Jumia Egypt",
      baseUrl: "https://www.jumia.com.eg",
      searchUrl: "https://www.jumia.com.eg/catalog/?q={keyword}&page={page}",
      maxPages: 5,
      paginationType: "url",
      selectors: {
        productContainer: ".-phs.-pvxs.row._no-g._4cl-3cm-shs > .c-prd",
        title: ".info > h3",
        price: ".info > .prc",
        link: ".core",
        image: "article .img-c img",
      },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      waitOptions: { waitUntil: "domcontentloaded" },
    };

    super(config);
  }

  /**
   * Override initializeSearch to handle Jumia's cookie popup
   * @param {Page} page - Puppeteer page instance
   * @param {string} keyword - Search keyword
   */
  async initializeSearch(page, keyword) {
    const url = this.buildSearchUrl(keyword, 1);
    await page.goto(url, this.waitOptions);

    // Handle cookie popup
    await this.handleJumiaCookiePopup(page);

    // Scroll to load all products
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  }

  /**
   * Handle Jumia-specific cookie popup
   * @param {Page} page - Puppeteer page instance
   */
  async handleJumiaCookiePopup(page) {
    try {
      const clsElement = await page.$(".cls");
      if (clsElement) {
        await clsElement.click();
        console.log("Cookie popup closed");
      }
    } catch (err) {
      console.log("No cookie popup found");
    }
  }

  /**
   * Override extractSingleProduct to handle Jumia's specific image and link format
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
      product.title = await page.evaluate(
        (el) => el.querySelector(".info > h3")?.textContent.trim() || "Null",
        handle
      );

      // Extract price
      product.price = await page.evaluate(
        (el) => el.querySelector(".info > .prc")?.textContent.trim() || "Null",
        handle
      );

      // Extract link
      product.link = await page.evaluate(
        (el) => el.querySelector(".core")?.getAttribute("href") || "Null",
        handle
      );

      if (product.link !== "Null" && !product.link.startsWith("http")) {
        product.link = `https://www.jumia.com.eg${product.link}`;
      }

      // Extract image (Jumia uses data-src)
      product.img = await page.evaluate((el) => {
        const imgElement = el.querySelector("article .img-c img");
        return (
          imgElement?.getAttribute("data-src") ||
          imgElement?.getAttribute("src") ||
          "Null"
        );
      }, handle);
    } catch (error) {
      console.error("Error extracting Jumia product:", error);
    }

    return product;
  }

  /**
   * Override scrapeWithUrlPagination to add scroll behavior per page
   * @param {Page} page - Puppeteer page instance
   * @param {string} keyword - Search keyword
   * @param {Array} products - Products array to populate
   */
  async scrapeWithUrlPagination(page, keyword, products) {
    for (let pageNum = 1; pageNum <= this.maxPages; pageNum++) {
      try {
        const url = this.buildSearchUrl(keyword, pageNum);
        await page.goto(url, this.waitOptions);

        // Handle cookie popup on first page
        if (pageNum === 1) {
          await this.handleJumiaCookiePopup(page);
        }

        // Scroll to load all products
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));

        const pageProducts = await this.extractProductsFromPage(page);

        if (pageProducts.length === 0) {
          console.log(`No products found on page ${pageNum}, stopping`);
          break;
        }

        products.push(...pageProducts);
        console.log(
          `Extracted ${pageProducts.length} products from page ${pageNum}`
        );
      } catch (error) {
        console.error(`Error on Jumia page ${pageNum}:`, error);
      }
    }
  }
}

// Export function for backward compatibility
async function scrapeJumia(keyword) {
  const scraper = new JumiaScraper();
  return await scraper.scrape(keyword);
}

// const test = async()=> console.log( await scrapeJumia("RTX"));
// test()
module.exports = scrapeJumia;


