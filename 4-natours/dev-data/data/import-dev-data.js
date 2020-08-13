const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const Tour = require('../../models/tour-model');

dotenv.config({ path: './config.env' });

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

//Read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//IMport data to DB
const importAllToursData = async () => {
  try {
    await Tour.create(tours);

    console.log('Data added to data');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//Delete all data from DB
const deleteAllToursData = async () => {
  try {
    await Tour.deleteMany();

    console.log('Deleted!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importAllToursData();
} else if (process.argv[2] === '--delete') {
  deleteAllToursData();
}
