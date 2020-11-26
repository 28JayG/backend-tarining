const dotenv = require('dotenv');
const mongoose = require('mongoose');
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Exception');
  server.close(() => {
    process.exit(1);
  });
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,

    //To use the new Server Discover and Monitoring engine
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'))
  .catch((error) => console.log(error));

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`App running on port ... ${port}`)
);

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection');
  server.close(() => {
    process.exit(1);
  });
});
