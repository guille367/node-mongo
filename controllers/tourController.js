const Tour = require('../models/toursModel');
const APIFeature = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

exports.getAllTours = async (req, res) => {
  try {
    const feature = new APIFeature(Tour.find(), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();

    const tours = await feature.query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: JSON.stringify(error.message)
    })
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error
    })
  }
};

exports.createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body)
  
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success update',
      requestedAt: req.requestTime,
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error
    })
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
      status: 'success deleted',
      requestedAt: req.requestTime
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error
    })
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: null,
          numOfTours: { $sum: 1 },
          numOfRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: { stats }
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error
    })
  }
}

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind:  '$startDates'
      },
      {
        $match: { 
          startDates: {  
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {  
          _id: { $month: '$startDates' },
          numOfTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      }, 
      {
        $sort: { numOfTourStarts: -1 }
      },
      {
        $limit: 6
      }
    ])

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: { plan }
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error
    })
  }
}