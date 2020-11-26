const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour needs a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Tour needs a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour needs a group size'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: {
        values: ['easy', 'difficult', 'medium'],
        message: 'Difficulty is only: easy. medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "We can't sell for free"],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'Tour needs a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Tour needs a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationInWeeks').get(function () {
  return Math.ceil(this.duration / 7);
});

//DOCUMENT MIDDLEWARE
//runs before save() and create() event and ! for insert...()/update().
tourSchema.pre('save', function (next) {
  //the this here refers to the document that is created
  this.slug = slugify(this.name, { lower: true });
  next();
});

/*post does not have access to this,
 but you can get doc from it as a function parameter*/
//  tourSchema.post('save', function(doc, next){
//    console.log(doc); next();
//  })

//QUERY MIDDLEWARE
//
tourSchema.pre('find', function (next) {
  //this ---> query
  this.find({ secretTour: { $ne: true } });

  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
