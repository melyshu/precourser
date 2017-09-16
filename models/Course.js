// The Mongoose Model for a Course object in the database
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

require('./Section.js');
const User = require('./User.js');

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
    required: 'pdf required',
    enum: ['PDF', 'PDFO', 'NPDF', 'XPDF']
  },
  audit: {
    type: String,
    trim: true,
    uppercase: true,
    required: 'audit required',
    enum: ['AUDIT', 'NAUDIT', 'XAUDIT']
  },

  rating: {
    score: { type: Number },
    semester: { type: String, ref: 'Semester' },
    description: { type: String, trim: true }
  },
  new: Boolean,
  recent: Boolean,

  evaluations: {
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
  status: {
    type: String,
    trim: true,
    required: 'status required',
    enum: ['Open', 'Closed', 'Canceled']
  },

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

courseSchema.statics.fullSelector = '-_instructorNames';

// Course.findFullById
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
    .exec()
    .then(function(course) {
      if (!course) return null;

      return User.count({ savedCourses: course._id }).then(function(count) {
        course.saves = count;
        return course;
      });
    });
};

courseSchema.statics.briefSelector =
  '-rawAttributes -banner -description -evaluations -assignments -readings -prerequisites ' +
  '-equivalentCourses -otherInformation -otherRequirements -_instructorNames';

// Course.searchBySemesterAndQuery
courseSchema.query.getBriefAndExec = function() {
  return this.select(mongoose.model('Course').briefSelector)
    .populate('sections')
    .lean()
    .exec();
};

// GET /api/semester/:semesterId[?courseSearch=query (optional)]
// GET /api/course/semester/:semesterId/search/:query
courseSchema.statics.searchBySemesterAndQuery = function(semesterId, query) {
  const distributionQueries = [];
  const pdfQueries = [];
  const auditQueries = [];
  const departmentQueries = [];
  const catalogNumberQueries = [];
  const titleQueries = [];
  const descriptionQueries = [];

  const cleanQuery = query.trim().replace(/\s+/g, ' ');

  const tokens = cleanQuery.split(' ');
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // distribution
    // https://ua.princeton.edu/sites/ua/files/Undergraduate%20Announcement%202010-11.pdf
    // ST and STX should no longer be in use
    if (/^(EC|EM|HA|LA|SA|QR|ST|STL|STN|STX|W)$/i.test(token)) {
      distributionQueries.push(token.toUpperCase());
      continue;
    }

    // pdf
    if (/^(NPDF|PDFO|PDF|XPDF)$/i.test(token)) {
      pdfQueries.push(token.toUpperCase());
      continue;
    }

    // audit
    if (/^(AUDIT|NAUDIT|XAUDIT)$/i.test(token)) {
      auditQueries.push(token.toUpperCase());
      continue;
    }

    // abbreviated audit
    if (/^(A|NA|XA)$/i.test(token)) {
      auditQueries.push(token.toUpperCase() + 'UDIT');
      continue;
    }

    // department code
    if (/^[A-Z]{3}[0-9]{1,3}[A-Z0-9]?$/i.test(token)) {
      departmentQueries.push(token.substr(0, 3));
      catalogNumberQueries.push('^' + token.substring(3));
      continue;
    }

    // department
    if (/^[A-Z]{3}$/i.test(token)) {
      departmentQueries.push(token);
      continue;
    }

    // catalog number
    if (/^[0-9]{3}[A-Z0-9]?$/i.test(token)) {
      catalogNumberQueries.push(token);
      continue;
    }

    // description
    if (/^[+]/i.test(token)) {
      descriptionQueries.push(token.substring(1));
      continue;
    }

    // title
    titleQueries.push(token);
  }

  const joinRegexOr = function(array) {
    return new RegExp(array.join('|'), 'i');
  };

  const joinRegexAnd = function(array) {
    return new RegExp(array.map(token => '(?=.*' + token + ')').join(''), 'i');
  };

  const queryDocument = {
    semester: semesterId
  };

  if (distributionQueries.length) {
    queryDocument.distribution = { $in: distributionQueries };
  }

  if (pdfQueries.length > 0) {
    queryDocument.pdf = { $in: pdfQueries };
  }

  if (auditQueries.length > 0) {
    queryDocument.audit = { $in: auditQueries };
  }

  if (departmentQueries.length && !catalogNumberQueries.length) {
    queryDocument.$or = [
      { department: { $regex: joinRegexOr(departmentQueries) } },
      { 'crossListings.department': { $regex: joinRegexOr(departmentQueries) } }
    ];
  }

  if (catalogNumberQueries.length && !departmentQueries.length) {
    queryDocument.$or = [
      { catalogNumber: { $regex: joinRegexOr(catalogNumberQueries) } },
      {
        'crossListings.catalogNumber': {
          $regex: joinRegexOr(catalogNumberQueries)
        }
      }
    ];
  }

  if (departmentQueries.length && catalogNumberQueries.length) {
    queryDocument.$and = [
      {
        $or: [
          { department: { $regex: joinRegexOr(departmentQueries) } },
          {
            'crossListings.department': {
              $regex: joinRegexOr(departmentQueries)
            }
          }
        ]
      },
      {
        $or: [
          { catalogNumber: { $regex: joinRegexOr(catalogNumberQueries) } },
          {
            'crossListings.catalogNumber': {
              $regex: joinRegexOr(catalogNumberQueries)
            }
          }
        ]
      }
    ];
  }

  if (titleQueries.length) {
    queryDocument.title = { $regex: joinRegexAnd(titleQueries) };
  }

  if (descriptionQueries.length) {
    queryDocument.description = { $regex: joinRegexAnd(descriptionQueries) };
  }

  return mongoose
    .model('Course')
    .find(queryDocument)
    .getBriefAndExec()
    .then(function(courses) {
      if (!courses) return null;
      return { searchedCourses: courses, loadingCourseSearch: false };
    });
};

// GET /api/course/:courseId
courseSchema.statics.findFullById = function(courseId) {
  return mongoose
    .model('Course')
    .findById(courseId)
    .getFullAndExec()
    .then(function(course) {
      if (!course) return null;
      return { selectedCourse: course };
    });
};

const Course = mongoose.model('Course', courseSchema);

// Export the Course model
module.exports = Course;
