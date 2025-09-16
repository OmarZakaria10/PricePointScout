const express = require("express");
const router = express.Router();
const redisClient = require("../utils/redis");

router.get("/", (req, res) => {
  res.status(200).json({
    status: "healthy",
    time: new Date(),
    message: "PricePointScout is running!",
  });
});

router.get("/ready", async (req, res) => {
  try {
    // Check database connection
    const dbState = require("mongoose").connection.readyState;
    if (dbState !== 1) {
      throw new Error("Database not connected");
    }
    // Check external services (if any)
    const isRedisHealthy = await redisClient.isConnectionHealthy();
    if (!isRedisHealthy) {
      throw new Error("Redis not connected");
    }

    // Format memory usage in MB for readability
    const memoryUsage = process.memoryUsage();
    const memoryInMB = {
      rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
    };

    res.status(200).json({
      status: "ready",
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || "1.0.0",
      uptime: process.uptime(),
      checks: {
        database: dbState ? "healthy" : "unhealthy",
        redis: isRedisHealthy ? "healthy" : "unhealthy",
        memory: memoryInMB,
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "not ready",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

router.get("/live", (req, res) => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

module.exports = router;
