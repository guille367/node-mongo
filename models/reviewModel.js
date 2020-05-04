const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  review: {
    type: String,
    required: [true, 'A review can not be empty']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a Tour']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a User']
  }
});

reviewSchema.set('toObject', { virtuals: true })
reviewSchema.set('toJSON', { virtuals: true })

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;