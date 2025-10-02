const Cart = require("../models/cartModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");

//add item to cart
exports.addItemToCart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const cart = await Cart.getOrCreateCart(userId);
  const updatedCart = await cart.addItem(req.body);
  res.status(200).json({
    status: "success",
    data: {
      cart: updatedCart,
    },
  });
});

exports.removeItemFromCart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const cart = await Cart.findByUser(userId);
  if (!cart) {
    return next(new AppError("No active cart found for user", 404));
  }
  const updatedCart = await cart.removeItem(req.params.itemId);
  res.status(200).json({
    status: "success",
    data: {
      cart: updatedCart,
    },
  });
});

exports.updateItemQuantity = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const cart = await Cart.findByUser(userId);
  if (!cart) {
    return next(new AppError("No active cart found for user", 404));
  }
  const updatedCart = await cart.updateItemQuantity(
    req.params.itemId,
    req.body.quantity
  );
  res.status(200).json({
    status: "success",
    data: {
      cart: updatedCart,
    },
  });
});

exports.clearCart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const cart = await Cart.findByUser(userId);
  if (!cart) {
    return next(new AppError("No active cart found for user", 404));
  }
  const clearedCart = await cart.clearCart();
  res.status(200).json({
    status: "success",
    data: {
      cart: clearedCart,
    },
  });
});

exports.getUserCart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  let cart = await Cart.findByUser(userId);
  if (!cart) {
    return next(new AppError("No active cart found for user", 404));
  }
  cart = cart.getCartItems();
  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});
