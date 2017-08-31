// The Mongoose Model for a Course object in the database
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const Instructor = require('./Instructor.js');
const Section = require('./Section.js');

const courseSchema = new mongoose.Schema({
  _id: { type: String, required: '_id required' },
  lastModified: { type: Date, required: 'lastModified required' },

  semester: { type: String, ref: 'Semester', required: 'semester required' },
  systemId: { type: String, index: true, required: 'systemId required' },

  department: {
    type: String,
    trim: true,
    uppercase: true,
    ref: 'Department',
    required: 'department required'
  },
  catalogNumber: {
    type: String,
    trim: true,
    uppercase: true,
    required: 'catalogNumber required'
  },
  crossListings: [
    {
      _id: false,
      department: {
        type: String,
        trim: true,
        uppercase: true,
        ref: 'Department',
        required: 'crossListings.department required'
      },
      catalogNumber: {
        type: String,
        trim: true,
        uppercase: true,
        required: 'crossListings.catalogNumber required'
      }
    }
  ],

  title: { type: String, trim: true, required: 'title required' },
  rawAttributes: {
    type: String,
    trim: true,
    required: 'rawAttributes required'
  },
  banner: { type: String, trim: true },
  description: { type: String, trim: true },
  // a very small number of courses do NOT have a description:
  // 1154001477, 1104000913, 1104001477, 1132001477, 1114000913, 1112001477, 1144001477,
  // 1122001477, 1152001477, 1142001477, 1102001477, 1134001477, 1124000913, 1124001477

  instructors: [{ type: String, ref: 'Instructor' }],
  _instructorNames: [{ type: String, trim: true }],

  distribution: { type: String, trim: true, uppercase: true },
  pdf: {
    type: String,
    trim: true,
    uppercase: true,
    required: true,
    enum: ['PDF', 'PDFO', 'NPDF', 'XPDF']
  },
  audit: {
    type: String,
    trim: true,
    uppercase: true,
    required: true,
    enum: ['AUDIT', 'NAUDIT', 'XAUDIT']
  },

  rating: Number,
  ratingDescription: { type: String, trim: true },
  new: Boolean,
  recent: Boolean,

  evaluations: {
    description: { type: String, trim: true },
    semester: { type: String, ref: 'Semester' },
    numeric: [
      {
        _id: false,
        field: { type: String, required: 'evaluations.numeric.field required' },
        score: { type: Number, required: 'evaluations.numeric.score required' }
      }
    ],
    written: [String]
  },

  sections: [{ type: String, ref: 'Section' }],
  classTypes: [{ type: String, trim: true }],
  seatsTaken: Number,
  seatsTotal: Number,

  assignments: String,
  grading: [
    {
      _id: false,
      component: {
        type: String,
        trim: true,
        required: 'grading.component required'
      },
      percent: { type: Number, required: 'grading.percent required' }
    }
  ],
  readings: [
    {
      _id: false,
      title: { type: String, trim: true, required: 'readings.title required' },
      author: { type: String, trim: true, required: 'readings.author required' }
    }
  ],
  reservedSeats: [String],

  prerequisites: { type: String, trim: true },
  equivalentCourses: { type: String, trim: true },
  otherInformation: { type: String, trim: true },
  otherRequirements: { type: String, trim: true },
  website: { type: String, trim: true }
});

courseSchema.virtual('courses', {
  ref: 'Course',
  localField: 'systemId',
  foreignField: 'systemId',
  justOne: false
});

/*
courseSchema.virtual('sections', {
  ref: 'Section',
  localField: '_id',
  foreignField: 'course',
  justOne: false
});
*/

courseSchema.statics.minimalSelector =
  '_id department catalogNumber title sections';
courseSchema.statics.findMinimalById = function(id) {
  return this.findById(id).select(this.minimalSelector).lean().exec();
};

courseSchema.statics.briefSelector =
  '-rawAttributes -banner -description -evaluations -assignments -readings -prerequisites ' +
  '-equivalentCourses -otherInformation -otherRequirements -_instructorNames';
courseSchema.statics.findBriefById = function(id) {
  return this.findById(id).select(this.briefSelector).lean().exec();
};

courseSchema.statics.findBriefByIdsAndSemester = function(ids, semester) {
  return this.find({ _id: { $in: ids }, semester: semester })
    .select(this.briefSelector)
    .lean()
    .exec();
};

courseSchema.statics.findBriefByInstructorAndSemester = function(
  instructor,
  semester
) {
  return this.find({ instructors: instructor, semester: semester })
    .select(this.briefSelector)
    .lean()
    .exec();
};

courseSchema.statics.findBriefByInstructor = function(instructor) {
  return this.find({ instructors: instructor })
    .select(this.briefSelector)
    .lean()
    .exec();
};

courseSchema.query.getFullAndExec = function() {
  return this.select(mongoose.model('Course').fullSelector)
    .populate({
      path: 'instructors',
      select: mongoose.model('Instructor').fullSelector,
      populate: {
        path: 'courses',
        select: mongoose.model('Course').briefSelector,
        options: { sort: '-semester' }
      }
    })
    .populate('sections')
    .populate({
      path: 'courses',
      select: mongoose.model('Course').briefSelector,
      populate: {
        path: 'instructors',
        select: mongoose.model('Instructor').briefSelector
      },
      options: { sort: '-semester' }
    })
    .lean()
    .exec();
};

courseSchema.statics.fullSelector = '-_instructorNames';
courseSchema.statics.findFullById = function(courseId) {
  return this.findById(courseId).getFullAndExec().then(function(course) {
    if (!course) return null;
    return { selectedCourse: course };
  });
};

courseSchema.statics.findFullByInstructor = function(instructor) {
  return this.find({ instructors: instructor })
    .select(this.fullSelector)
    .populate('instructors sections')
    .lean()
    .exec();
};

courseSchema.statics.search = function(semester, string) {
  const catalogNumberQueries = [];
  const departmentQueries = [];
  const titleQueries = [];
  const pdfQueries = [];
  const auditQueries = [];

  const cleanString = string.trim().replace(/\s+/g, ' ');

  const queries = cleanString.split(' ');
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    const upper = query.toUpperCase();

    if (/^[A-Z]{3}[0-9]{3}([A-Z]|[0-9])?$/.test(upper)) {
      departmentQueries.push(upper.substr(0, 3));
      catalogNumberQueries.push(upper.substring(3));
      continue;
    }

    if (/^[A-Z]{3}$/.test(upper)) {
      departmentQueries.push(upper);
      continue;
    }

    if (/^[0-9]{3}([A-Z]|[0-9])?$/.test(upper)) {
      catalogNumberQueries.push(upper);
      continue;
    }

    if (/^(NPDF|PDFO|PDF)$/.test(upper)) {
      pdfQueries.push(upper);
      continue;
    }

    if (/^(AUDIT|NAUDIT)$/.test(upper)) {
      auditQueries.push(upper);
      continue;
    }

    if (query.length > 3) {
      titleQueries.push(query.toLowerCase());
      continue;
    }
  }

  const queryDocument = {};
  if (departmentQueries.length > 0)
    queryDocument.department = { $in: departmentQueries };
  if (catalogNumberQueries.length > 0)
    queryDocument.catalogNumber = { $in: catalogNumberQueries };
  if (titleQueries.length > 0)
    queryDocument.title = { $regex: new RegExp(titleQueries.join('|'), 'i') };
  if (pdfQueries.length > 0) queryDocument.pdf = { $in: pdfQueries };
  if (auditQueries.length > 0) queryDocument.audit = { $in: auditQueries };
  if (semester === 'all') queryDocument.recent = true;
  else queryDocument.semester = semester;

  return this.find(queryDocument)
    .select(this.briefSelector)
    .populate('sections')
    .lean()
    .exec();
};

const Course = mongoose.model('Course', courseSchema);

// Export the Course model
module.exports = Course;
