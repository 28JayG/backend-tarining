const express = require('express');

const {
  getAllTours,
  createTour,
  getTourById,
  updateTourById,
  deleteTourById,
  checkId,
} = require('../controllers/tour-controller');

const router = express.Router();

router.param('tourId', checkId);

router.route('/').get(getAllTours).post(createTour);

router
  .route('/:tourId')
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);

module.exports = router;
