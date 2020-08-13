const dotenv = require('dotenv');
const mongoose = require('mongoose');
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
app.listen(port, () => console.log(`App running on port ... ${port}`));
