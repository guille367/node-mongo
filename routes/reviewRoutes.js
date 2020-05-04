const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(reviewController.findReviews)
  .post(authController.protect, authController.restrictTo('user'), reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.findReviewById);

module.exports = router;