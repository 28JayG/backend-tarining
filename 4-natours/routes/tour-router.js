const express = require('express');

const {
  getAllTours,
  createTour,
  getTour: getTourById,
  updateTour: updateTourById,
  deleteTour: deleteTourById,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tour-controller');
const { protect, restrictTo } = require('../controllers/auth-controller');

const router = express.Router();

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(protect, getAllTours).post(createTour);

router
  .route('/:tourId')
  .get(getTourById)
  .patch(updateTourById)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTourById);

module.exports = router;
