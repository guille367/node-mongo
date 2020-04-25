const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourschema = mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    minlenght: [10, 'A tour name must have more or equal 10 characters'],
    maxlenght: [40, 'A tour name must have less or equal 40 characters'],
    // validate: [validator.isAlpha, 'Invalid name'] //external validators
  },
  rating: { 
    type: Number, 
    default: 4.5 
  },
  price: { 
    type: Number, 
    required: [true, 'A tour must have a price']  
  },
  duration: { 
    type: Number, 
    required: [true, 'A tour must have a duration'] 
  },
  maxGroupSize: { 
    type: Number, 
    required: [true, 'A tour must have group size']
  },
  difficulty: { 
    type: String, 
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficult is neither easy, medium or difficult' 
    }
  },
  ratingsAverage: { 
    type: Number, 
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0below 5'],
  },
  ratingsQuantity: { 
    type: Number, 
    default: 0 
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: `Discount price ({VALUE}) should be below the regular price`
    }  
  },
  summary: { 
    type: String, 
    trim: true, 
    required: [true, 'A tour must have a summary'] 
  },
  description: { 
    type: String, 
    trim: true 
  },
  imageCover: { 
    type: String, 
    required: [true, 'A tour must have an image'] 
  },
  images: { 
    type: [String] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now(), 
    select: false 
  },
  startDates: { 
    type: [Date] 
  },
  slug: {
    type: String
  },
  secretTour: {
    type: Boolean
  }
}); 

tourschema.set('toObject', { virtuals: true })
tourschema.set('toJSON', { virtuals: true })

tourschema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourschema.pre('find', function(next) {
  this.find({ secretTour: { $ne: true } });
  next();
});


tourschema.post('save', function(doc, next) {
  console.log(doc);
  next();
});

tourschema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourschema);  
module.exports = Tour;