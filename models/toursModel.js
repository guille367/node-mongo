const mongoose = require('mongoose');

const tourschema = mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  rating: { type: Number, default: 4.5 },
  price: { type: Number, required: [true, 'A tour must have a price']  },
  duration: { type: Number, required: [true, 'A tour must have a duration'] },
  maxGroupSize: { type: Number, required: [true, 'A tour must have group size'] },
  difficulty: { type: String, required: [true, 'A tour must have a difficulty'] },
  ratingsAverage: { type: Number, default: 4.5 },
  ratingsQuantity: { type: Number, default: 0 },
  priceDiscount: Number,
  summary: { type: String, trim: true, required: [true, 'A tour must have a summary'] },
  description: { type: String, trim: true },
  imageCover: { type: String, required: [true, 'A tour must have an image'] },
  images: { type: [String] },
  createdAt: { type: Date, default: Date.now(), select: false },
  startDate: { type: [Date] }
}); 

const Tour = mongoose.model('Tour', tourschema);  

module.exports = Tour;