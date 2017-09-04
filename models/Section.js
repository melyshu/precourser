// The Mongoose Model for a Section object in the database
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const sectionSchema = new mongoose.Schema({
  _id: { type: String, required: '_id required' },
  lastModified: { type: Date, required: 'lastModified required' },
  semester: { type: String, ref: 'Semester', required: 'semester required' },
  course: { type: String, ref: 'Course', required: 'course required' },
  classNumber: { type: String, trim: true }, // older sections may not have classNumber
  name: {
    type: String,
    trim: true,
    uppercase: true,
    required: 'name required'
  },
  seatsTaken: Number,
  seatsTotal: Number,
  status: {
    type: String,
    trim: true,
    required: 'status required',
    enum: ['Open', 'Closed', 'Canceled']
  },
  meetings: [
    {
      _id: false,

      // time data must be either all provided or all undefined
      days: [Number],
      startTime: Number,
      endTime: Number,

      // location data must be either all provided or all undefined
      building: { type: String, trim: true },
      buildingNumber: { type: String, trim: true },
      room: { type: String, trim: true }
    }
  ]
});

const Section = mongoose.model('Section', sectionSchema);

// Export the Section model
module.exports = Section;
