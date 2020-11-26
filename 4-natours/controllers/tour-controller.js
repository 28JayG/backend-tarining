const Tour = require('../models/tour-model');
const APIFeatures = require('../utils/api-features');
const catchAsync = require('../utils/catch-async');
const AppErrors = require('../utils/app-error');

// gets all the tours
exports.getAllTours = catchAsync(async (req, res, next) => {
  //Executing the query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  //sending the response to client
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

//get a tour of some id
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  if(!tour){
    return next(new AppErrors('No tour with that id', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: { tour: newTour },
  });
});
// update a tour
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.tourId, req.body, {
    new: true,
    runValidators: true,
  });

  if(!tour){
    return next(new AppErrors('No tour with that id', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

//delete tour
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.tourId);

  if(!tour){
    return next(new AppErrors('No tour with that id', 404))
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: null,
        ratingCount: { $sum: '$ratingsQuantity' },
        totalTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        tourCount: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { tourCount: -1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
