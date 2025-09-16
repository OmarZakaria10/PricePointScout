/**
 * Metrics utility module for PricePointScout.
 * 
 * This module sets up and exports Prometheus metrics for monitoring HTTP requests,
 * scrape requests, and active users. It uses prom-client to define and register
 * custom metrics and default Node.js metrics, and exposes them via a registry.
 */

const client = require("prom-client");

// Create a Registry to register the metrics
const register = new client.Registry();

// Add default Node.js metrics
client.collectDefaultMetrics({ register });

// Custom metrics for your application
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const scrapeRequestsTotal = new client.Counter({
  name: "scrape_requests_total",
  help: "Total number of scrape requests",
  labelNames: ["website", "status"],
});

const scrapeRequestDuration = new client.Histogram({
  name: "scrape_request_duration_seconds",
  help: "Duration of scrape requests in seconds",
  labelNames: ["website"],
  buckets: [1, 5, 10, 30, 60],
});

const activeUsers = new client.Gauge({
  name: "active_users_total",
  help: "Number of currently active users",
});

// Register custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);
register.registerMetric(scrapeRequestsTotal);
register.registerMetric(scrapeRequestDuration);
register.registerMetric(activeUsers);

module.exports = {
  register,
  httpRequestDuration,
  httpRequestsTotal,
  scrapeRequestsTotal,
  scrapeRequestDuration,
  activeUsers,
};
