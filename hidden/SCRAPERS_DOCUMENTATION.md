# Modular Scrapers Documentation

This document explains the new modular scraper architecture for PricePointScout. The scrapers have been refactored to be more maintainable, readable, and support the three main pagination patterns found in e-commerce websites.

## Architecture Overview

### Base Scraper Class
The `BaseScraper` class provides common functionality for all scrapers:
- **Product extraction** (title, price, link, image)
- **Three pagination strategies**:
  1. **URL-based**: Page number embedded in URL (e.g., `?page=2`)
  2. **Button-based**: Click "Next" button to navigate pages
  3. **Scroll-based**: Infinite scroll loading
- **Error handling** and retry logic
- **Browser management** integration
- **Popup handling** (cookies, modals)

### Scraper Classes
Each website has its own scraper class extending `BaseScraper`:
- `AmazonScraper` - URL-based pagination
- `JumiaScraper` - URL-based pagination
- `NoonScraper` - Button-based pagination
- `CompuMartScraper` - Scroll-based pagination
- `SigmaScraper` - Custom search flow
- `ElbadrScraper` - Single page results

## Usage Examples

### Basic Usage (Backward Compatible)

```javascript
// Import the refactored scrapers (same interface as before)
const scrapers = require('./scrapers/scraper.refactored');

// Use individual scrapers
const amazonProducts = await scrapers.amazon('RTX 4060');
const jumiaProducts = await scrapers.jumia('RTX 4060');
const noonProducts = await scrapers.noon('RTX 4060');
```

### Advanced Usage with Registry

```javascript
const { registry } = require('./scrapers/scraper.refactored');

// Get scraper information
console.log(registry.getStats());
// Output: 
// {
//   totalScrapers: 6,
//   paginationTypes: { url: 3, button: 1, scroll: 1, custom: 1 },
//   scraperNames: ['amazon', 'jumia', 'noon', 'compumart', 'sigma', 'elbadr']
// }

// Run a specific scraper
const products = await registry.run('amazon', 'RTX 4060');

// Run multiple scrapers concurrently
const results = await registry.runMultiple(['amazon', 'jumia'], 'RTX 4060');
console.log(results);
// Output:
// {
//   amazon: { name: 'amazon', results: [...], success: true, error: null },
//   jumia: { name: 'jumia', results: [...], success: true, error: null }
// }

// Run all scrapers
const allResults = await registry.runAll('RTX 4060');
```

### Filtering by Pagination Type

```javascript
// Get all scroll-based scrapers
const scrollScrapers = registry.getByPaginationType('scroll');
console.log(scrollScrapers);
// Output: [{ name: 'compumart', func: [Function], paginationType: 'scroll', ... }]

// Get all URL-based scrapers
const urlScrapers = registry.getByPaginationType('url');
```

## Creating New Scrapers

### Step 1: Define Configuration

```javascript
const BaseScraper = require('./BaseScraper');

class NewSiteScraper extends BaseScraper {
  constructor() {
    const config = {
      name: "New Site",
      baseUrl: "https://example.com",
      searchUrl: "https://example.com/search?q={keyword}&page={page}",
      maxPages: 5,
      paginationType: "url", // or "button" or "scroll"
      selectors: {
        productContainer: ".product-item",
        title: ".product-title",
        price: ".product-price",
        link: ".product-link",
        image: ".product-image",
        nextButton: ".pagination-next", // for button pagination
        endOfResults: ".no-more-results" // optional
      },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      waitOptions: { waitUntil: "networkidle2" },
      scrollOptions: { distance: 200, delay: 10 } // for scroll pagination
    };

    super(config);
  }
}
```

### Step 2: Override Methods (If Needed)

```javascript
class NewSiteScraper extends BaseScraper {
  // ... constructor ...

  /**
   * Override for custom search initialization
   */
  async initializeSearch(page, keyword) {
    await page.goto(this.baseUrl);
    await page.click('.search-button');
    await page.type('.search-input', keyword);
    await page.keyboard.press('Enter');
    await page.waitForNavigation();
  }

  /**
   * Override for custom product extraction
   */
  async extractSingleProduct(page, handle) {
    const product = await super.extractSingleProduct(page, handle);
    
    // Custom processing
    if (product.price !== "Null") {
      product.price = product.price.replace(/[^\d.,]/g, ''); // Clean price
    }
    
    return product;
  }

  /**
   * Override for custom popup handling
   */
  async handlePopups(page) {
    try {
      await page.click('.close-modal');
    } catch (error) {
      // Ignore if no popup
    }
  }
}
```

### Step 3: Export and Register

```javascript
// Export function for backward compatibility
async function scrapeNewSite(keyword) {
  const scraper = new NewSiteScraper();
  return await scraper.scrape(keyword);
}

module.exports = scrapeNewSite;
```

## Pagination Patterns

### 1. URL-based Pagination
```javascript
// Example: Amazon, Jumia
// URL changes: page=1, page=2, page=3...
paginationType: "url"
searchUrl: "https://example.com/search?q={keyword}&page={page}"
```

### 2. Button-based Pagination
```javascript
// Example: Noon
// Click "Next" button to load next page
paginationType: "button"
selectors: {
  nextButton: ".next-page-button"
}
```

### 3. Scroll-based Pagination
```javascript
// Example: CompuMart
// Infinite scroll loads more products
paginationType: "scroll"
scrollOptions: {
  distance: 200,  // pixels to scroll
  delay: 10       // milliseconds between scrolls
}
```

## Configuration Options

### Required Fields
- `name`: Human-readable scraper name
- `baseUrl`: Website base URL
- `searchUrl`: Search URL pattern with `{keyword}` and `{page}` placeholders
- `selectors.productContainer`: CSS selector for product containers

### Optional Fields
- `maxPages`: Maximum pages to scrape (default: 5)
- `paginationType`: 'url', 'button', or 'scroll' (default: 'url')
- `userAgent`: Custom user agent string
- `waitOptions`: Puppeteer navigation options
- `scrollOptions`: Scroll behavior configuration

### Selector Fields
- `selectors.title`: Product title selector
- `selectors.price`: Product price selector
- `selectors.link`: Product link selector
- `selectors.image`: Product image selector
- `selectors.nextButton`: Next button selector (button pagination)
- `selectors.endOfResults`: End of results indicator

## Error Handling

The base scraper includes comprehensive error handling:
- Individual product extraction errors don't stop the entire scrape
- Page navigation errors are logged and skipped
- Invalid products are filtered out
- Timeout handling for slow-loading pages

## Performance Considerations

- Scrapers run concurrently when using `runMultiple()` or `runAll()`
- Browser instances are reused via `browserInstance.js`
- Automatic retry logic for failed operations
- Memory-efficient product filtering

## Migration from Old Scrapers

The new scrapers maintain backward compatibility:

```javascript
// Old way (still works)
const scrapeSigma = require('./scrapers/sigmaScraper');
const products = await scrapeSigma('RTX 4060');

// New way (recommended)
const { registry } = require('./scrapers/scraper.refactored');
const products = await registry.run('sigma', 'RTX 4060');
```

## Testing

```javascript
// Test a single scraper
const { registry } = require('./scrapers/scraper.refactored');

async function testScraper() {
  try {
    const products = await registry.run('amazon', 'test product');
    console.log(`Found ${products.length} products`);
    console.log('Sample product:', products[0]);
  } catch (error) {
    console.error('Scraper failed:', error);
  }
}

testScraper();
```

This modular architecture makes it easy to:
- Add new scrapers
- Maintain existing ones
- Handle different pagination patterns
- Debug issues
- Scale the scraping system
