const redisClient = require("./redis");

class CacheService {
  constructor() {
    this.CACHE_DURATION = parseInt(process.env.CACHE_DURATION || "600"); // 10 minutes
    this.MAX_LIFETIME = parseInt(process.env.MAX_CACHE_LIFETIME || "3600"); // 1 hour
  }

  generateSourceKey(keyword, source) {
    return `scrape:${keyword}:source:${source}`;
  }

  async getSourceResults(keyword, sources) {
    if (!redisClient.isConnected) return { cached: [], needsScraping: sources };

    const results = {
      cached: [],
      needsScraping: [],
    };

    // Create a pipeline for batch processing
    const pipeline = redisClient.client.pipeline();

    // Add get commands to pipeline
    sources.forEach((source) => {
      const key = this.generateSourceKey(keyword, source);
      pipeline.get(key);
    });

    // Execute pipeline
    const responses = await pipeline.exec();
    // console.log(responses);
    // Process responses
    if (responses && responses.length) {
      responses.forEach((result, index) => {
        // result is [err, value]
        const [err, value] = result;
        const source = sources[index];

        if (!err && value) {
          results.cached.push({
            source,
            data: JSON.parse(value),
          });
        } else {
          results.needsScraping.push(source);
        }
      });
    }

    return results;
  }

  async setSourceResults(keyword, source, data) {
    if (!redisClient.isConnected) return;

    const key = this.generateSourceKey(keyword, source);
    const duration = this.CACHE_DURATION;

    await redisClient.client.set(key, JSON.stringify(data), "EX", duration);
  }

  async bulkSetSourceResults(keyword, sourcesData) {
    if (!redisClient.isConnected || !sourcesData.length) return;

    const duration = this.CACHE_DURATION;
    const pipeline = redisClient.client.pipeline();

    sourcesData.forEach(({ source, data }) => {
      const key = this.generateSourceKey(keyword, source);
      pipeline.set(key, JSON.stringify(data), "EX", duration);
    });

    await pipeline.exec();
  }
}

const cacheService = new CacheService();
module.exports = cacheService;
