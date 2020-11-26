const express = require('express');

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
} = require('../controllers/user-controller');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require('../controllers/auth-controller');

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:token').patch(resetPassword);

router.route('/update-my-password').patch(protect, updatePassword);
router.route('/updateMe').patch(protect, updateMe);
router.route('/').get(getAllUsers).post(createUser);

router.route('/:userId').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
