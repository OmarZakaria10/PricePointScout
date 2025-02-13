// src/routes/scraperRoutes.js
const express = require("express");
const router = express.Router();

const { scrapeProducts } = require("../controllers/scrapeController");
const authController = require("./../controllers/authController");

router.get("/guest", scrapeProducts);
router.use(authController.protect);
router.get("/user", scrapeProducts);

module.exports = router;
