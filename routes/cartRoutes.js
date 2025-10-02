const express = require("express");
const cartController = require("./../controllers/cartController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.get("/getCart", cartController.getUserCart);
router.post("/addItem", cartController.addItemToCart);
router.delete("/removeItem/:itemId", cartController.removeItemFromCart);
router.patch("/updateItem/:itemId", cartController.updateItemQuantity);
router.delete("/clearCart", cartController.clearCart);

module.exports = router;
