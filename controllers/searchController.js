const Search = require("../models/searchModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const mongoose = require("mongoose");

exports.CreateSearch = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const newSearch = await Search.create({
    keyword: req.query.keyword,
    sources: req.query.sources,
    sort: req.query.sort,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    user: userId,
  });
  res.status(200).json({
    status: "success",
    data: {
      newSearch,
    },
  });
});

exports.getMySearches = catchAsync(async (req, res) => {
  const searches = await Search.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
    {
      $project: {
        keyword: 1,
        sources: 1,
        sort: 1,
        minPrice: 1,
        maxPrice: 1,
        createdAt: 1,
        updatedAt: 1,
        resultsCount: { $size: "$results" }
      }
    }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      searches,
    },
  });
});

exports.getSearch = factory.getOne(Search);

exports.deleteSearch = factory.deleteOne(Search);
