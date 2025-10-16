const Redis = require("ioredis");

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected && this.client) {
      return this.client;
    }

    return new Promise((resolve, reject) => {
      this.client = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        lazyConnect: false, // Connect immediately
      });

      this.client.on("connect", () => {
        console.log("Connected to Redis");
        this.isConnected = true;
        resolve(this.client);
      });

      this.client.on("error", (err) => {
        console.error("Error connecting to Redis:", err);
        this.isConnected = false;
        reject(err);
      });

      this.client.on("close", () => {
        console.log("Redis client disconnected");
        this.isConnected = false;
      });
    });
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

  async isConnectionHealthy() {
    try {
      if (!this.client || !this.isConnected) {
        return false;
      }

      // Ping Redis to check if connection is alive
      const result = await this.client.ping();
      return result === "PONG";
    } catch (error) {
      console.error("Redis health check failed:", error);
      this.isConnected = false;
      return false;
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      client: this.client ? "initialized" : "null",
      status: this.client?.status || "unknown",
    };
  }

  async quit() {
    if (this.client) {
      await this.client.quit();
    }
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
