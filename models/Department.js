// The Mongoose Model for a Department object in the database
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const departmentSchema = new mongoose.Schema({
  _id: { type: String, trim: true, uppercase: true, required: '_id required' },
  lastModified: { type: Date, required: 'lastModified required' },
  name: { type: String, trim: true, required: 'name required' }
});

departmentSchema.statics.fullSelector = '';

// Department.findFull
departmentSchema.query.getFullAndExec = function() {
  return this.select(mongoose.model('Department').fullSelector).lean().exec();
};

// GET /api/startup
departmentSchema.statics.findFull = function() {
  return mongoose
    .model('Department')
    .find()
    .getFullAndExec()
    .then(function(departments) {
      if (!departments) return null;
      return { departments: departments };
    });
};

const Department = mongoose.model('Department', departmentSchema);

// Export the Department model
module.exports = Department;
