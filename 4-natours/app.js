const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tour-router');
const userRouter = require('./routes/user-router');

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;