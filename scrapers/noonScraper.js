const BaseScraper = require("./BaseScraper");

class NoonScraper extends BaseScraper {
  constructor() {
    const config = {
      name: "Noon Egypt",
      baseUrl: "https://www.noon.com/egypt-en/",
      searchUrl:
        "https://www.noon.com/egypt-en/search/?q={keyword}&page={page}",
      maxPages: 5,
      paginationType: "url",
      selectors: {
        productContainer:
          "#catalog-page-container > div > div.ProductListDesktop_container__08z7c > div.ProductListDesktop_content__3KHXe > div.ProductListDesktop_layoutWrapper__Kiw3A > div",
        title:
          " a > div.ProductBoxVertical_wrapper__xPj_f > div.ProductDetailsSection_wrapper__yLBrw > h2",
        price:
          " a > div.ProductBoxVertical_wrapper__xPj_f > div.ProductDetailsSection_wrapper__yLBrw > div.Price_container__URFkc.Price_pBox__tnjgl > div.Price_sellingPrice__HFKZf > strong",
        link: "a",
        image:
          "a > div.ProductBoxVertical_wrapper__xPj_f > div.ProductImageSection_wrapper__VNNpq > div > div.ProductImageCarousel_wrapper__zHOzK > div.ProductImageCarousel_slidesWrapper__mcy8v > div:nth-child(1) > div > div > img",
      },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      waitOptions: { waitUntil: "networkidle2" },
    };
    super(config);
  }

  /**
   * Override buildSearchUrl to handle Amazon's specific URL format
   * @param {string} keyword - Search keyword
   * @param {number} pageNum - Page number
   * @returns {string} Complete search URL
   */
  buildSearchUrl(keyword, pageNum) {
    const encodedKeyword = encodeURIComponent(keyword);
    return this.searchUrl
      .replace("{keyword}", encodedKeyword)
      .replace("{page}", pageNum);
  }
  /**
   * Override extractSingleProduct to handle Amazon's specific link format
   * @param {Page} page - Puppeteer page instance
   * @param {ElementHandle} handle - Product element handle
   * @returns {Object} Product object
   */
  async extractSingleProduct(page, handle) {
    const product = await super.extractSingleProduct(page, handle);


    if (product.link !== "Null" && !product.link.startsWith("http")) {
      product.link = `https://www.noon.com/${product.link}`;
    }

    return product;
  }
}

async function scrapeNoon(keyword) {
  const scraper = new NoonScraper();
  return await scraper.scrape(keyword);
}
module.exports = scrapeNoon;

// const test = async () => console.log(await scrapeNoon("rtx"));
// test();

// const BaseScraper = require("./BaseScraper");

// class NoonScraper extends BaseScraper {
//   constructor() {
//     const config = {
//       name: "Noon Egypt",
//       baseUrl: "https://www.noon.com",
//       searchUrl:
//         "https://www.noon.com/egypt-en/?utm_source=C1000088L&utm_medium=cpc&utm_campaign=C1000151355N_eg_en_web_searchxxexactandphrasexxbrandpurexx08082022_noon_web_c1000088l_acquisition_sembranded_&gad_source=1&gclid=CjwKCAiAqrG9BhAVEiwAaPu5zmxVnj-z53T9isNFm6plA3VmW_F1fWD6AvCWo7j2R3qsId8fL7iuLRoCHnAQAvD_BwE",
//       maxPages: 3,
//       paginationType: "button",
//       selectors: {
//         productContainer:
//           "#catalog-page-container > div > div.ProductListDesktop_container__08z7c > div.ProductListDesktop_content__3KHXe > div.ProductListDesktop_layoutWrapper__Kiw3A",
//         title:
//           ".eSrvHE > a > div > div > div.sc-433dbb72-1.kCPylA > div:nth-child(1) > div > div.sc-47ce7046-1.fuvgwB > div.sc-47ce7046-2.uMZsC > div:nth-child(2) > div > div > div > img",
//         price:
//           ".eSrvHE > a > div > div > div.sc-433dbb72-23.gUfohz > div.sc-433dbb72-26.ymgIA > div > div.sc-97957b12-1.fYKLkk > strong",
//         link: ".eSrvHE > a",
//         image:
//           ".eSrvHE > a > div > div > div.sc-433dbb72-1.kCPylA > div:nth-child(1) > div > div.sc-47ce7046-1.fuvgwB > div.sc-47ce7046-2.uMZsC > div:nth-child(2) > div > div > div > img",
//         nextButton:
//           "#__next > div > section > div > div > div.sc-796e5e26-3.gVWVXu > div.sc-796e5e26-8.kpOZck > div > ul > li.next > a > div > img",
//       },
//       userAgent:
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//       waitOptions: { waitUntil: "networkidle2" },
//       scrollOptions: { distance: 200, delay: 10 },
//     };

//     super(config);
//   }

//   /**
//    * Override initializeSearch to handle Noon's search process
//    * @param {Page} page - Puppeteer page instance
//    * @param {string} keyword - Search keyword
//    */
//   async initializeSearch(page, keyword) {
//     await page.goto(this.searchUrl, this.waitOptions);

//     // Search for the product
//     const searchBarSelector =
//       "#default-header-desktop > header > div > div.DesktopSiteSearch_wrapper__5Zy5v.HeaderDesktop_searchWrapper__CE_gg > div.DesktopInput_inputWrapper__Ke1A9 > input";

//     try {
//       await page.waitForSelector(searchBarSelector, { timeout: 10000 });
//       await page.click(searchBarSelector);
//       await page.type(searchBarSelector, keyword);
//       await page.keyboard.press("Enter");
//       await page.waitForNavigation(this.waitOptions);
//     } catch (error) {
//       console.error("Error during Noon search initialization:", error);
//       throw error;
//     }
//   }

//   /**
//    * Override extractSingleProduct to handle Noon's specific structure
//    * @param {Page} page - Puppeteer page instance
//    * @param {ElementHandle} handle - Product element handle
//    * @returns {Object} Product object
//    */
//   async extractSingleProduct(page, handle) {
//     const product = {
//       title: "Null",
//       price: "Null",
//       link: "Null",
//       img: "Null",
//     };

//     try {
//       // Extract title from image alt attribute
//       product.title = await page.evaluate((el) => {
//         const imgElement = el.querySelector(
//           ".eSrvHE > a > div > div > div.sc-433dbb72-1.kCPylA > div:nth-child(1) > div > div.sc-47ce7046-1.fuvgwB > div.sc-47ce7046-2.uMZsC > div:nth-child(2) > div > div > div > img"
//         );
//         return imgElement?.getAttribute("alt")?.trim() || "Null";
//       }, handle);

//       // Extract price
//       product.price = await page.evaluate((el) => {
//         const priceElement = el.querySelector(
//           ".eSrvHE > a > div > div > div.sc-433dbb72-23.gUfohz > div.sc-433dbb72-26.ymgIA > div > div.sc-97957b12-1.fYKLkk > strong"
//         );
//         return priceElement?.textContent?.trim() || "Null";
//       }, handle);

//       // Extract link
//       product.link = await page.evaluate((el) => {
//         const linkElement = el.querySelector(".eSrvHE > a");
//         return linkElement?.getAttribute("href") || "Null";
//       }, handle);

//       if (product.link !== "Null" && !product.link.startsWith("http")) {
//         product.link = `https://www.noon.com${product.link}`;
//       }

//       // Extract image
//       product.img = await page.evaluate((el) => {
//         const imgElement = el.querySelector(
//           ".eSrvHE > a > div > div > div.sc-433dbb72-1.kCPylA > div:nth-child(1) > div > div.sc-47ce7046-1.fuvgwB > div.sc-47ce7046-2.uMZsC > div:nth-child(2) > div > div > div > img"
//         );
//         return imgElement?.getAttribute("src") || "Null";
//       }, handle);
//     } catch (error) {
//       console.error("Error extracting Noon product:", error);
//     }

//     return product;
//   }

//   /**
//    * Override scrapeWithButtonPagination to add auto-scroll before extraction
//    * @param {Page} page - Puppeteer page instance
//    * @param {string} keyword - Search keyword
//    * @param {Array} products - Products array to populate
//    */
//   async scrapeWithButtonPagination(page, keyword, products) {
//     let pageNum = 1;

//     while (pageNum <= this.maxPages) {
//       try {
//         console.log(`Scraping Noon page ${pageNum}`);

//         // Scroll to load all products on current page
//         await this.performScroll(page);

//         const pageProducts = await this.extractProductsFromPage(page);

//         if (pageProducts.length === 0) {
//           console.log(`No products found on page ${pageNum}, stopping`);
//           break;
//         }

//         products.push(...pageProducts);
//         console.log(
//           `Extracted ${pageProducts.length} products from page ${pageNum}`
//         );

//         // Try to click next button
//         const hasNextButton = await this.clickNextButton(page);
//         if (!hasNextButton) {
//           console.log("No more pages available");
//           break;
//         }

//         pageNum++;

//         // Wait for page to load
//         await page.waitForTimeout(3000);
//       } catch (error) {
//         console.error(`Error on Noon page ${pageNum}:`, error);
//         break;
//       }
//     }
//   }

//   /**
//    * Override clickNextButton with timeout handling
//    * @param {Page} page - Puppeteer page instance
//    * @returns {boolean} True if next button was clicked successfully
//    */
//   async clickNextButton(page) {
//     try {
//       const nextButton = await page.$(this.selectors.nextButton);
//       if (nextButton) {
//         await Promise.race([
//           nextButton.click(),
//           new Promise((_, reject) =>
//             setTimeout(() => reject(new Error("Click timeout")), 2000)
//           ),
//         ]);
//         return true;
//       }
//     } catch (error) {
//       console.log("Next button not found or click failed:", error.message);
//     }

//     return false;
//   }
// }

// // Export function for backward compatibility
// async function scrapeNoon(keyword) {
//   const scraper = new NoonScraper();
//   return await scraper.scrape(keyword);
// }

// test = async () => console.log(await scrapeNoon("RTX"));
// test();

// module.exports = scrapeNoon;
