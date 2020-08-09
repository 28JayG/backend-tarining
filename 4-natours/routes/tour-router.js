const express = require('express');

const {
  getAllTours,
  createTour,
  getTourById,
  updateTourById,
  deleteTourById,
} = require('../controllers/tour-controller');

const router = express.Router();

router.route('/').get(getAllTours).post(createTour);

router
  .route('/:tourId')
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);

module.exports = router;
