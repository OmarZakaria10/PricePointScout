const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again later.",
  // Skip rate limiting for health checks
  skip: (req) => req.path === "/health" || req.path === "/metrics",
});

const limitWindowMs = 60 * 1000; // 1 minute
const scraperLimiter = rateLimit({
  windowMs: limitWindowMs, // 1 minute
  max: 3, // Limit each IP to 3 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: `Too many scraping requests from this IP, please try again after ${limitWindowMs / 1000} seconds.`,
});

module.exports = { limiter, scraperLimiter };
