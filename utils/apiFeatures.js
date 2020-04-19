class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryObj = { ...this.queryString };
    const excludedFilters = ['page', 'limit', 'sort', 'fields'];
    excludedFilters.forEach(ef => { delete queryObj[ef] })

    queryObj = JSON.stringify(queryObj).replace(/\b(gte|lte|gt|lt)\b/g, match => `$${match}`);
    const filter = JSON.parse(queryObj);
    this.query = this.query.find(filter);
   
    return this;
  }

  sort() {
    this.query = this.query.sort(this.queryString.sort.replace(',', ' '));
    return this;
  }

  limit() {
    if(this.queryString.fields) {
      this.query = this.query.select(this.queryString.fields.replace(',', ' '))
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    let page = this.queryString.page * 1 || 1;
    let limit = this.queryString.limit * 1 || 100;
    let skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;