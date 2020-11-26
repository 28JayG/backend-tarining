const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tour-router');
const userRouter = require('./routes/user-router');
const AppError = require('./utils/app-error');
const globalErrorHandler = require('./controllers/error-controller');

const app = express();
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res) => {
  next(new AppError(`Can't find ${req.originalUrl} in the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
