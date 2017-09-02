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

// Instructor.searchByQuery
instructorSchema.query.getFullAndExec = function() {
  return this.select(mongoose.model('Instructor').fullSelector)
    .populate({
      path: 'courses',
      select: mongoose.model('Course').briefSelector,
      options: { sort: '-semester' },
      populate: { path: 'sections' }
    })
    .lean()
    .exec();
};

// GET /api/instructor/search/:query
instructorSchema.statics.searchByQuery = function(query) {
  const cleanQuery = query.trim().replace(/\s+/g, ' ');
  const tokens = cleanQuery.split(' ');

  if (tokens.length === 1) {
    return mongoose
      .model('Instructor')
      .find({
        $or: [
          { fullName: { $regex: new RegExp(tokens[0], 'i') } },
          { position: { $regex: new RegExp(tokens[0], 'i') } }
        ]
      })
      .getFullAndExec()
      .then(function(instructors) {
        if (!instructors) return null;
        return { searchedInstructors: instructors };
      });
  } else {
    const queryDocument = {
      $and: tokens.map(token => ({
        $or: [
          { fullName: { $regex: new RegExp(token, 'i') } },
          { position: { $regex: new RegExp(token, 'i') } }
        ]
      }))
    };

    return mongoose
      .model('Instructor')
      .find(queryDocument)
      .getFullAndExec()
      .then(function(instructors) {
        if (!instructors) return null;
        return { searchedInstructors: instructors };
      });
  }
};

const Instructor = mongoose.model('Instructor', instructorSchema);

// Export the Instructor model
module.exports = Instructor;
