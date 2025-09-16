const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const scraperRoutes = require("./routes/scrapeRoutes");
const healthRouter = require("./routes/healthCheckRoutes");
const searchRoutes = require("./routes/searchRoutes");
const cookieParser = require("cookie-parser");
const {
  register,
  httpRequestDuration,
  httpRequestsTotal,
} = require("./utils/metrics");

const app = express();

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
app.use("/health", healthRouter);
app.use("/users", userRouter);
app.use("/scrape", scraperRoutes);
app.use("/search", searchRoutes);
//
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
