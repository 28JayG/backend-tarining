const express = require('express');

const {
  getAllTours,
  createTour,
  getTour: getTourById,
  updateTour: updateTourById,
  deleteTour: deleteTourById,
  getTourStats,
} = require('../controllers/tour-controller');

const router = express.Router();

router.route('/tour-stats').get(getTourStats);

router.route('/').get(getAllTours).post(createTour);

router
  .route('/:tourId')
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);

module.exports = router;
