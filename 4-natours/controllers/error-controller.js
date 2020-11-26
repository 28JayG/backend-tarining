const AppErrors = require('../utils/app-error');

const sendErrorForDevelopement = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error,
  });
};

const sendErrorForProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Error', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value} `;
  return new AppErrors(message, 400);
};

const handleDuplicateFields = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please enter another value`;

  return new AppErrors(message, 400);
};

const handleValidationError = (err) => {
  const errorMessages = Object.values(err.errors).map((error) => error.message);
  const message = `Invalid Input Data. ${errorMessages.join('. ')}`;

  return new AppErrors(message, 400);
};

const handleJWTError = () =>
  new AppErrors('Invalid Token. Please login again', 401);


const handleJWTExpireError = () =>
new AppErrors('Your token has expired. Please login again', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'err';

  if (process.env.NODE_ENV === 'development') {
    sendErrorForDevelopement(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateFields(error);
    if (err.name === 'ValidationError') error = handleValidationError(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpireError();
    sendErrorForProduction(error, res);
  }
};
