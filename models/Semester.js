// The Mongoose Model for a Semester object in the database
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const semesterSchema = new mongoose.Schema({
  _id: { type: String, required: '_id required' }, // four digit code
  lastModified: { type: Date, required: 'lastModified required' },

  name: { type: String, required: 'name required' },
  abbr: { type: String, required: 'abbr required' },
  startDate: { type: String, required: 'startDate required' }, // yyyy-mm-dd corresponding to 'classes begin'
  endDate: { type: String, required: 'endDate required' }, // yyyy-mm-dd corresponding to 'classes end'

  courses: [{ type: String, ref: 'Course' }] // only used for importing
});

semesterSchema.statics.fullSelector = '-courses';

// Semester.findFull
semesterSchema.query.getFullAndExec = function() {
  return this.select(mongoose.model('Semester').fullSelector)
    .sort('-_id')
    .lean()
    .exec();
};

// GET /api/startup
semesterSchema.statics.findFull = function() {
  return mongoose
    .model('Semester')
    .find()
    .getFullAndExec()
    .then(function(semesters) {
      if (!semesters) return null;
      return { semesters: semesters };
    });
};

const Semester = mongoose.model('Semester', semesterSchema);

// Export the Semester model
module.exports = Semester;
