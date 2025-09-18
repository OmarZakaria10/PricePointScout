// src/routes/scraperRoutes.js
const express = require("express");
const router = express.Router();
const { scraperLimiter } = require("../middlewares/rateLimit");
const { scrapeProducts } = require("../controllers/scrapeController");
const authController = require("./../controllers/authController");

router.use("/", scraperLimiter);
router.get("/guest", scrapeProducts);
router.use(authController.protect);
router.get("/user", scrapeProducts);

module.exports = router;
