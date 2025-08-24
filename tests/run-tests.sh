#!/bin/bash

# Scraper Test Runner Script
# Tests all scrapers with RTX keyword for Jenkins CI/CD pipeline

set -e  # Exit on any error

echo "🚀 Starting Scraper Test Pipeline"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TEST_KEYWORD="${TEST_KEYWORD:-RTX}"
TEST_TYPE="${TEST_TYPE:-quick}"
MAX_RETRY="${MAX_RETRY:-2}"

echo -e "${BLUE}Test Configuration:${NC}"
echo "  Keyword: $TEST_KEYWORD"
echo "  Test Type: $TEST_TYPE"
echo "  Max Retries: $MAX_RETRY"
echo ""

# Function to run test with retry
run_test_with_retry() {
    local test_command="$1"
    local test_name="$2"
    local retry_count=0
    
    while [ $retry_count -le $MAX_RETRY ]; do
        echo -e "${BLUE}🔄 Running $test_name (attempt $((retry_count + 1)))${NC}"
        
        if eval "$test_command"; then
            echo -e "${GREEN}✅ $test_name passed${NC}"
            return 0
        else
            retry_count=$((retry_count + 1))
            if [ $retry_count -le $MAX_RETRY ]; then
                echo -e "${YELLOW}⚠️  $test_name failed, retrying in 5 seconds...${NC}"
                sleep 5
            else
                echo -e "${RED}❌ $test_name failed after $((MAX_RETRY + 1)) attempts${NC}"
                return 1
            fi
        fi
    done
}

# Pre-flight checks
echo -e "${BLUE}🔍 Pre-flight checks${NC}"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check if npm packages are installed
if [ ! -d "node_modules" ]; then
    echo -e "${RED}❌ node_modules not found. Run 'npm install' first.${NC}"
    exit 1
fi

# Check if test files exist
if [ ! -f "tests/quick-test.js" ]; then
    echo -e "${RED}❌ Test files not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pre-flight checks passed${NC}"
echo ""

# Create test results directory
mkdir -p test-results

# Run the appropriate test based on TEST_TYPE
case $TEST_TYPE in
    "quick")
        echo -e "${BLUE}🏃 Running quick test suite${NC}"
        run_test_with_retry "timeout 480 node tests/quick-test.js" "Quick Test Suite"
        TEST_EXIT_CODE=$?
        ;;
    "full")
        echo -e "${BLUE}🔬 Running full test suite${NC}"
        run_test_with_retry "timeout 1200 node tests/scraper.test.js" "Full Test Suite"
        TEST_EXIT_CODE=$?
        ;;
    "performance")
        echo -e "${BLUE}⚡ Running performance tests${NC}"
        run_test_with_retry "timeout 1800 node tests/scraper.test.js --performance" "Performance Tests"
        TEST_EXIT_CODE=$?
        ;;
    "individual")
        if [ -z "$SCRAPER_NAME" ]; then
            echo -e "${RED}❌ SCRAPER_NAME environment variable required for individual tests${NC}"
            exit 1
        fi
        echo -e "${BLUE}🎯 Testing individual scraper: $SCRAPER_NAME${NC}"
        run_test_with_retry "timeout 300 node tests/quick-test.js --scraper $SCRAPER_NAME $TEST_KEYWORD" "Individual Scraper Test"
        TEST_EXIT_CODE=$?
        ;;
    *)
        echo -e "${RED}❌ Invalid TEST_TYPE: $TEST_TYPE${NC}"
        echo "Valid options: quick, full, performance, individual"
        exit 1
        ;;
esac

# Generate summary report
echo ""
echo -e "${BLUE}📊 Test Summary${NC}"
echo "=================="

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed successfully${NC}"
    echo -e "${GREEN}🎉 Ready for deployment${NC}"
else
    echo -e "${RED}❌ Some tests failed${NC}"
    echo -e "${RED}🚫 Deployment blocked${NC}"
fi

echo ""
echo "Test completed at: $(date)"
echo "Exit code: $TEST_EXIT_CODE"

# Save test results for Jenkins artifacts
echo "{
  \"timestamp\": \"$(date -Iseconds)\",
  \"test_type\": \"$TEST_TYPE\",
  \"keyword\": \"$TEST_KEYWORD\",
  \"exit_code\": $TEST_EXIT_CODE,
  \"status\": \"$([ $TEST_EXIT_CODE -eq 0 ] && echo 'PASSED' || echo 'FAILED')\"
}" > test-results/test-summary.json

exit $TEST_EXIT_CODE
