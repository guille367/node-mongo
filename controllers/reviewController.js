const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const Review = require('../models/reviewModel');

exports.createReview = catchAsync(async (req, res, next) => {
  console.log(req.body)
  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review
    }
  })
});

exports.findReviews = catchAsync(async (req, res, next) => {
  const feature = new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();
  
  const reviews = await feature.query;

  res.status(200).json({
    status: 'success',
    data: {
      reviews
    }
  })
});

exports.findReviewById = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id)

  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  })
});
