const Redis = require("ioredis");

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  connect() {
    if (!this.isConnected) {
      this.client = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        }
        
      });

      this.client.on("connect", () => {
        console.log("Connected to Redis");
        this.isConnected = true;
      });

      this.client.on("error", (err) => {
        console.error("Error connecting to Redis:", err);
        this.isConnected = false;
      });

      this.client.on("close", () => {
        console.log("Redis client disconnected");
        this.isConnected = false;
      });
    }

    return this.client;
  }

  async get(key) {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  }

  async set(key, value, expiryMode, duration) {
    try {
      return await this.client.set(key, value, expiryMode, duration);
    } catch (error) {
      console.error("Redis set error:", error);
      return null;
    }
  }

  async quit() {
    if (this.client) {
      await this.client.quit();
    }
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
