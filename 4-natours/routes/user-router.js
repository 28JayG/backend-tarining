const express = require('express');

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/user-controller');

const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);

router.route('/:userId').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
