const mongoose = require("mongoose");
// const User = require("./userModel");

const SearchSchema = new mongoose.Schema(
  {
    keyword: { type: String, required: true },
    sources: [{ type: String, required: true }],
    sort: { type: String, enum: ["asc", "des", null] },
    minPrice: { type: Number },
    maxPrice: { type: Number },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Associate with User
    results: [
      {
        title: { type: String },
        price: { type: String },
        link: { type: String },
        img: { type: String },
      },
    ], // Store search results
  },
  {
    timestamps: true,
    virtuals: true,
    // Add these options to include virtuals when converting to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// to limit 10 search results to be saved in the database
async function enforceSearchLimit(userId) {
  const userSearches = await mongoose
    .model("Search")
    .find({ user: userId })
    .sort({ createdAt: 1 });

  if (userSearches.length >= 10) {
    await mongoose.model("Search").findByIdAndDelete(userSearches[0]._id); // Delete oldest search
  }
}

// Middleware for `save()` (individual search creation)
SearchSchema.pre("save", async function (next) {
  await enforceSearchLimit(this.user._id);
  next();
});

module.exports = mongoose.model("Search", SearchSchema);
