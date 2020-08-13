class APIFeatures {
    constructor(query, queryObject) {
      this.query = query;
      this.queryObject = queryObject;
    }
  
    filter() {
      const queryObject = { ...this.queryObject };
      const excludedFields = ['limit', 'page', 'sort', 'fields'];
      //basic filtering
      excludedFields.forEach(
        (excludedField) => delete queryObject[excludedField]
      );
  
      //advanced filtering
      let queryString = JSON.stringify(queryObject);
      queryString = queryString.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => '$' + match
      );
  
      this.query = this.query.find(JSON.parse(queryString));
  
      return this;
    }
  
    sort() {
      if (this.queryObject.sort) {
        const sortBy = this.queryObject.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
  
      return this;
    }
  
    limitFields() {
      if (this.queryObject.fields) {
        const fields = this.queryObject.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
  
      return this;
    }
  
    paginate() {
      const page = this.queryObject.page * 1 || 1;
      const limit = this.queryObject.limit * 1 || 100;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  }

  module.exports = APIFeatures;