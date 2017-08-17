// The Mongoose Model for a Department object in the database
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const departmentSchema = new mongoose.Schema({
  _id: { type: String, trim: true, uppercase: true, required: '_id required' },
  lastModified: { type: Date, required: 'lastModified required' },
  name: { type: String, trim: true, required: 'name required' }
});

const Department = mongoose.model('Department', departmentSchema);

// Export the Department model
module.exports = Department;
