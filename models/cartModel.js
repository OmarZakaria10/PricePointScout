const mongoose = require("mongoose");
const User = require("./userModel");

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Associate with User
    items: [
      {
        // Remove custom _id definition - let Mongoose handle it automatically
        title: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        link: {
          type: String,
          required: true,
        },
        img: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ], // Array of cart items
    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active",
    },
  },
  {
    timestamps: true,
    virtuals: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for total items count
CartSchema.virtual("totalItems").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for total price
CartSchema.virtual("totalPrice").get(function () {
  return this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

// Method to add item to cart
CartSchema.methods.addItem = function (itemData) {
  const existingItem = this.items.find((item) => item.link === itemData.link);
  if (existingItem) {
    existingItem.quantity += itemData.quantity || 1;
  } else {
    this.items.push(itemData);
  }
  return this.save();
};

// Method to remove item from cart
CartSchema.methods.removeItem = function (itemId) {
  this.items = this.items.filter(
    (item) => item._id.toString() !== itemId.toString()
  );
  return this.save();
};

// Method to update item quantity
CartSchema.methods.updateItemQuantity = function (itemId, quantity) {
  const item = this.items.find(
    (item) => item._id.toString() === itemId.toString()
  );
  if (item) {
    if (quantity <= 0) {
      return this.removeItem(itemId);
    }
    item.quantity = quantity;
    return this.save();
  }
  throw new Error("Item not found in cart");
};

CartSchema.methods.getCartItems = function () {
  return {
    items: this.items,
    totalItems: this.totalItems,
    totalPrice: this.totalPrice,
  };
};

// Method to clear cart
CartSchema.methods.clearCart = function () {
  this.items = [];
  return this.save();
};

// Static method to find cart by user
CartSchema.statics.findByUser = function (userId) {
  return this.findOne({ user: userId, status: "active" });
};

// Static method to create or get cart for user
CartSchema.statics.getOrCreateCart = async function (userId) {
  let cart = await this.findByUser(userId);
  if (!cart) {
    cart = new this({
      user: userId,
      items: [],
    });
    await cart.save();
  }
  return cart;
};

// Index for faster queries
CartSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("Cart", CartSchema);
