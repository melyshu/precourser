// The Mongoose Model for a Course object in the database
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const instructorSchema = new mongoose.Schema({
  _id: { type: String, required: '_id required' },
  lastModified: { type: Date, required: 'lastModified required' },
  fullName: { type: String, trim: true, required: 'fullName required' },
  position: { type: String, trim: true },
  phone: { type: String, trim: true, lowercase: true },
  email: { type: String, trim: true, lowercase: true },
  office: { type: String, trim: true }
});

instructorSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'instructors',
  justOne: false
});

instructorSchema.statics.briefSelector = '_id lastModified fullName';

instructorSchema.statics.fullSelector = '';

instructorSchema.statics.findBriefById = function(id) {
  return this.findById(id).select(this.briefSelector).lean().then(function(instructor) {
    if (!instructor) return null;

    return mongoose.model('Course').findBriefByInstructor(instructor._id).then(function(courses) {
      instructor.courses = courses;
      return instructor;
    })
  });
};

instructorSchema.statics.findBriefByIdsAndSemester = function(ids, semester) {
  return this.find({_id: {$in: ids}}).select(this.briefSelector).lean().then(function(instructors) {
    const promises = [];
    for (let i = 0; i < instructors.length; i++) {
      const instructor = instructors[i];

      promises.push(
        mongoose.model('Course').findBriefByInstructorAndSemester(instructor._id, semester).then(function(courses) {
          instructor.courses = courses;
        })
      );
    }

    return Promise.all(promises).then(function() {
      return instructors;
    });
  });
};

instructorSchema.statics.fullSelector = '';
instructorSchema.statics.findFullById = function(id) {
  const instructorPromise = this.findById(id).select(this.fullSelector).lean().exec();
  const coursePromise = mongoose.model('Course').findFullByInstructor(id);

  return Promise.join(
    instructorPromise,
    coursePromise,
    function(instructor, courses) {
      if (!instructor) return instructor;

      instructor.courses = courses;
      return instructor;
    }
  );
};

instructorSchema.statics.search = function(semester, string) {
  const fullNameQueries = [];

  const cleanString = string.trim().replace(/\s+/g, ' ');

  const queries = cleanString.split(' ');
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    fullNameQueries.push(query);
  }

  const queryDocument = {}
  if (fullNameQueries.length > 0) {
    queryDocument.$and = [];
    for (let i = 0; i < fullNameQueries.length; i++) {
      const fullNameQuery = fullNameQueries[i];
      queryDocument.$and.push({
        fullName: {$regex: new RegExp(fullNameQuery, 'i')}
      });
    }
  }

  return this.find(queryDocument).lean().distinct('_id').then(function(ids) {
    return mongoose.model('Instructor').findBriefByIdsAndSemester(ids, semester);
  });
};

const Instructor = mongoose.model('Instructor', instructorSchema);

// Export the Instructor model
module.exports = Instructor;
