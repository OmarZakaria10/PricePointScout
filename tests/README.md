# Scraper Test Suite for PricePointScout

This test suite provides comprehensive testing for all e-commerce scrapers with the **RTX** keyword, designed for integration with Jenkins CI/CD pipeline.

## 📋 Test Files Overview

### Core Test Files
- **`scraper.test.js`** - Full comprehensive test suite with detailed validation
- **`quick-test.js`** - Fast test runner for CI/CD pipelines  
- **`integration.test.js`** - Integration tests and benchmarking
- **`run-tests.sh`** - Shell script for Jenkins integration

## 🚀 Available Test Commands

### NPM Scripts
```bash
# Quick test (recommended for CI/CD)
npm test

# Full comprehensive test suite
npm run test:full

# Integration and benchmark tests
npm run test:integration

# Performance tests
npm run test:performance

# Test specific scraper
npm run test:scraper amazon RTX

# Jenkins test runner
npm run test:jenkins
```

### Direct Node Commands
```bash
# Quick test all scrapers
node tests/quick-test.js

# Test specific scraper
node tests/quick-test.js --scraper amazon RTX

# Full test suite
node tests/scraper.test.js

# Performance tests
node tests/scraper.test.js --performance

# Integration tests
node tests/integration.test.js
```

### Shell Script (Jenkins)
```bash
# Basic usage
./tests/run-tests.sh

# With custom settings
TEST_KEYWORD="RTX 4090" TEST_TYPE="full" ./tests/run-tests.sh

# Individual scraper test
SCRAPER_NAME="amazon" TEST_TYPE="individual" ./tests/run-tests.sh
```

## 🧪 Test Types

### 1. Quick Test (`TEST_TYPE=quick`)
- **Duration**: ~2-3 minutes
- **Purpose**: Fast validation for CI/CD
- **Checks**: Basic functionality, product count, response structure
- **Timeout**: 30 seconds per scraper

### 2. Full Test (`TEST_TYPE=full`)  
- **Duration**: ~5-10 minutes
- **Purpose**: Comprehensive validation
- **Checks**: Product structure, RTX relevance, data quality
- **Timeout**: 60 seconds per scraper

### 3. Performance Test (`TEST_TYPE=performance`)
- **Duration**: ~10-15 minutes  
- **Purpose**: Performance benchmarking
- **Checks**: Response times, multiple runs, consistency
- **Features**: 3 iterations per scraper with timing

### 4. Integration Test
- **Duration**: ~5 minutes
- **Purpose**: Test scraper integration and error handling
- **Checks**: Structure validation, error handling, benchmarking

## 🛠 Configuration Options

### Environment Variables
```bash
# Test keyword (default: RTX)
export TEST_KEYWORD="RTX 4090"

# Test type
export TEST_TYPE="quick"  # quick|full|performance|individual

# Maximum retries
export MAX_RETRY="2"

# Specific scraper for individual tests
export SCRAPER_NAME="amazon"
```

## 📊 Test Results

### Success Criteria
✅ **PASS**: All validations succeed
- Products found
- Valid product structure
- RTX-related products found
- Response within timeout

⚠️ **WARNING**: Minor issues
- No products found but scraper works
- Some products have invalid structure

❌ **FAIL**: Critical issues  
- Scraper crashes or times out
- Invalid response format
- Network errors

### Output Artifacts
- `test-results/test-summary.json` - Test summary for Jenkins
- Console logs with detailed results
- Performance benchmarks (for performance tests)

## 🔧 Jenkins Integration

The Jenkins pipeline includes:

1. **Quick Scraper Test** (parallel)
   - Tests all scrapers with RTX keyword
   - 3-minute timeout
   - Archives test results

2. **Integration Tests** (parallel)
   - Structure and error handling tests
   - 5-minute timeout

3. **Performance Tests** (conditional)
   - Only on main/master branch
   - 15-minute timeout
   - Benchmarking results

### Jenkins Pipeline Stages
```groovy
stage('Scraper Tests') {
    parallel {
        stage('Quick Scraper Test') { ... }
        stage('Integration Tests') { ... }
    }
}
```

## 🏷 Supported Scrapers

- **Amazon Egypt** (`amazon`)
- **Jumia Egypt** (`jumia`) 
- **Noon Egypt** (`noon`)
- **Elbadr Group** (`elbadr`)

## 📝 Test Data Validation

Each product is validated for:
- **Title**: Non-empty string
- **Price**: Valid price string  
- **Link**: Valid URL
- **Image**: Valid image URL (optional)
- **RTX Relevance**: Contains RTX-related keywords

## 🐛 Troubleshooting

### Common Issues

1. **Browser Timeout**
   ```bash
   # Increase timeout
   export PUPPETEER_TIMEOUT=60000
   ```

2. **Network Issues**
   ```bash
   # Increase retry count
   export MAX_RETRY=3
   ```

3. **Individual Scraper Failure**
   ```bash
   # Test specific scraper
   npm run test:scraper amazon RTX
   ```

### Debug Mode
```bash
# Enable verbose logging
export DEBUG=true
./tests/run-tests.sh
```

## 💡 Example Usage

### Testing RTX Graphics Cards
```bash
# Quick test for RTX products
npm test

# Test specific RTX model
TEST_KEYWORD="RTX 4090" npm test

# Performance test for RTX scrapers
npm run test:performance
```

### CI/CD Integration
```groovy
// In Jenkinsfile
environment {
    TEST_KEYWORD = 'RTX'
    TEST_TYPE = 'quick'
}

sh './tests/run-tests.sh'
```

## 📈 Expected Results

For **RTX** keyword testing:
- **Amazon**: 10-50 RTX products
- **Jumia**: 5-20 RTX products  
- **Noon**: 10-40 RTX products
- **Elbadr**: 1-10 RTX products

*Results may vary based on inventory and website availability*
