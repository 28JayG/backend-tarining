const User = require("../models/user-model");
const catchAsync = require("../utils/catch-async");

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
  res.status(500).json({
    status: 'error',
    message: 'The route is not yet implemented!',
  });
};
