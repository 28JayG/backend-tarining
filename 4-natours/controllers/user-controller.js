const User = require('../models/user-model');
const AppErrors = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');

filterObject = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

//get users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //sending the response to client
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //check if password data is POSted
  if (req.body.passsord || req.body.passwordConfirm) {
    return next(
      new AppErrors(
        'This not path for passoword change. Use /updateMyPassword',
        400
      )
    );
  }
  //filter unwanted fields that are not allowed to be updated
  const filteredBody = filterObject(req.body, 'name', 'email');

  //update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: 'success', user: updatedUser });
});

//delete user
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({ status: 'success', data: null });
});

//create user
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route is not yet implemented!',
  });
};

//get user
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route is not yet implemented!',
  });
};

//update user
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route is not yet implemented!',
  });
};

//delete user
exports.deleteUser = (req, res) => {
  res.status(200).json({
    status: 'error',
    message: 'The route is not yet implemented!',
  });
};
