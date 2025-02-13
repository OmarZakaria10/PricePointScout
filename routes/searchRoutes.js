const express = require("express");
// const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const searchController = require("./../controllers/searchController");

const router = express.Router();

router.use(authController.protect);
router.get("/mySearches", searchController.getMySearches);
router.get("/getSearch/:id", searchController.getSearch);
router.delete("/deleteSearch/:id", searchController.deleteSearch);

module.exports = router;
