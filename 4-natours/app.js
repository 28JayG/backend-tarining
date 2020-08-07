const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// gets all the tours
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
};

//get a tour of some id
const getTourById = (req, res) => {
  const tour = tours.find((tour) => tour.id === req.params.tourId * 1);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

//adds a new tour
const createTour = (req, res) => {
  const newTourId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newTourId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) console.error(err);
      res.status(201).send('Done!');
    }
  );
};
// update a tour
const updateTourById = (req, res) => {
  if (req.params.tourId * 1 > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...',
    },
  });
};

//delete tour
const deleteTourById = (req, res) => {
  if (req.params.tourId * 1 > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:tourId', getTourById);
// app.get('/api/v1/tours', getAllTours);

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:tourId')
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);

const port = 3000;
app.listen(port, () => console.log(`App running on port ... ${port}`));
