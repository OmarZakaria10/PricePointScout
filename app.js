const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const scraperRoutes = require("./routes/scrapeRoutes");
const healthRouter = require("./routes/healthCheckRoutes");
const searchRoutes = require("./routes/searchRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const { limiter } = require("./middlewares/rateLimit.js");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const {
  register,
  httpRequestDuration,
  httpRequestsTotal,
} = require("./utils/metrics");

const app = express();

// Trust proxy - IMPORTANT for NGINX/Ingress to get real client IPs
app.set("trust proxy", 1);

// CORS Configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? function (origin, callback) {
          callback(null, true);
        }
      : [
          // Only allow specific origins in production
          "http://localhost:5173",
          "http://localhost:5174",
          "http://localhost:3000",
          process.env.FRONTEND_URL,
          // Add your production frontend URL here
          // process.env.FRONTEND_URL
        ],
  credentials: true,
};

app.use(cors(corsOptions));

// Security middleware
app.use(limiter);
app.use(helmet()); // Set security HTTP headers
app.use(xss()); // Clean user input from malicious HTML/JS
app.use(mongoSanitize()); // Prevent NoSQL injection attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));
// Serving static files
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());

// Metrics middleware to track HTTP requests
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;

    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);

    httpRequestsTotal.labels(req.method, route, res.statusCode).inc();
  });

  next();
});

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error.message);
  }
});
app.use("/api/health", healthRouter);
app.use("/api/users", userRouter);
app.use("/api/scrape", scraperRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/cart", cartRoutes);
//
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
