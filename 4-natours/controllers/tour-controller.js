const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// gets all the tours
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
};

//get a tour of some id
exports.getTourById = (req, res) => {
  const tour = tours.find((tour) => tour.id === req.params.tourId * 1);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
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
exports.updateTourById = (req, res) => {
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
exports.deleteTourById = (req, res) => {
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
