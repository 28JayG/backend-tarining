const crypto = require('crypto');
const { promisify } = require('util');

const jwt = require('jsonwebtoken');

const User = require('../models/user-model');
const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');
const sendEmail = require('../utils/email');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIERS_IN,
  });

const createAndSendToken = (statusCode, user, res) => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //Check if email and password exits,
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  //check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  //if okay send token to client
  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 201));
  }

  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //Get token and check if its there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please login.', 401));
  }

  //validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if user still exist
  const userWithDecodedId = await User.findById(decoded.id);
  if (!userWithDecodedId) {
    return next(
      new AppError('The user belonging to this token does not exist', 401)
    );
  }
  //if user changed password after the token was issued
  if (await userWithDecodedId.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Password changed recently. Please login again', 401)
    );
  }

  req.user = userWithDecodedId;
  next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  //roles is an array
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError(
        'You do not have suffiencet permissions to perform this action',
        403
      )
    );
  }

  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get user based on posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with this email', 404));
  }

  //generate random token
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password?
   Submit a patch request with new password and confirm password to:\n ${resetURL}.
  \n If you didn't forgot your password please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Your password reset token. VALID FOR ONLY 10 MINUTES`,
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new AppError('Error sending email! Try again later.', 500));
  }

  res.status(200).json({
    status: 'success',
    message: 'reset token sent to email',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest();

  //get user based on token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //if token has not expired, and user exists, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or Expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //update the changedPasswordAt property
  //login the user, send JWT

  createAndSendToken(200, user, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // get user from the collection
  const user = await User.findById(req.user.id).select('+password');

  // check if posted current password is corrent
  if (!(await user.verifyPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  //update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //login user
  createAndSendToken(200, user, res);
});
