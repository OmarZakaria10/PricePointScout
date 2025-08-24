# 🕐 Timeout Configuration Updates Summary

## Updated Timeout Values

### Jenkins Pipeline (`jenkinsfile`)
- **Integration Tests**: 300s → **600s** (10 minutes)
- **Performance Tests**: 900s → **1800s** (30 minutes)

### Test Configuration (`tests/test-config.json`)

#### Test Scenarios
- **RTX Basic**: 300s (already high, kept as is)
- **RTX 4090**: 45s → **90s**
- **RTX 4060**: 30s → **75s**
- **Graphics Card**: 60s → **120s**
- **NVIDIA**: 45s → **90s**

#### Individual Scrapers
- **Amazon**: 45s → **90s**
- **Jumia**: 30s → **75s**
- **Noon**: 60s → **120s**
- **Elbadr**: 20s → **60s**

#### Test Types
- **Quick Test**: 30s → **90s**
- **Full Test**: 60s → **180s** (3 minutes)
- **Performance Test**: 120s → **300s** (5 minutes)

#### Jenkins Configuration
- **Overall Timeout**: 10min → **20min**

### Quick Test Runner (`tests/quick-test.js`)
- **Per Scraper Timeout**: 30s → **90s**

### Main Test Suite (`tests/scraper.test.js`)
- **Per Test Timeout**: 60s → **180s** (3 minutes)

### Shell Script Runner (`tests/run-tests.sh`)
- **Quick Test Suite**: 180s → **480s** (8 minutes)
- **Full Test Suite**: 600s → **1200s** (20 minutes)
- **Performance Tests**: 900s → **1800s** (30 minutes)
- **Individual Scraper**: 120s → **300s** (5 minutes)

### Integration Tests (`tests/integration.test.js`)
- **Structure Test**: 10s → **60s**

## Timeout Rationale

### Why These Changes?
1. **Network Variability**: Some scrapers may be slow due to network conditions
2. **Heavy Pages**: E-commerce sites can take time to load all content
3. **Rate Limiting**: Some sites may impose delays between requests
4. **CI/CD Environment**: Jenkins may have different performance characteristics

### Timeout Hierarchy
```
Jenkins Overall (20min)
├── Performance Tests (30min total)
├── Full Test Suite (20min total)  
├── Quick Test Suite (8min total)
└── Individual Tests (5min each)
    ├── Amazon (90s)
    ├── Noon (120s) [slowest]
    ├── Jumia (75s)
    └── Elbadr (60s)
```

### Expected Performance
- **Quick Tests**: 3-8 minutes total
- **Full Tests**: 10-20 minutes total
- **Performance Tests**: 15-30 minutes total
- **Individual Scraper**: 1-5 minutes each

## Testing the New Timeouts

```bash
# Test with new timeouts
npm test                    # Should complete in ~8 minutes max
npm run test:full          # Should complete in ~20 minutes max
npm run test:performance   # Should complete in ~30 minutes max

# Individual scraper tests
npm run test:scraper amazon RTX    # Up to 5 minutes
npm run test:scraper noon RTX      # Up to 5 minutes (slowest)
```

## Environment Variables Override

You can still override timeouts via environment variables:

```bash
# Custom timeout for shell script (in seconds)
TEST_TIMEOUT=600 ./tests/run-tests.sh

# Individual scraper with custom keyword
SCRAPER_NAME="amazon" TEST_KEYWORD="RTX 4090" ./tests/run-tests.sh
```

These increased timeouts should provide much more breathing room for the scrapers to complete successfully, especially in slower network conditions or when the target websites are under heavy load. 🚀
