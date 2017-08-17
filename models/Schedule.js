// The Mongoose Model for a Schedule object in the database
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const User = require('./User.js');
const Semester = require('./Semester.js');

const scheduleSchema = new mongoose.Schema({
  /* _id: { type: mongoose.Schema.Types.ObjectId }, */
  created: { type: Date, required: 'created required' },
  lastModified: { type: Date, required: 'lastModified required' },
  name: { type: String, trim: true, required: 'name required' },
  user: { type: String, ref: 'User', index: true, required: 'user required' },
  semester: { type: String, ref: 'Semester', required: 'semester required' },
  courses: [{ type: String, ref: 'Course' }],
  sections: [{ type: String, ref: 'Section' }],
  public: Boolean
});

scheduleSchema.statics.createByUserSemesterAndName = function(
  userId,
  semesterId,
  name
) {
  const userPromise = mongoose.model('User').findById(userId).lean().exec();
  const semesterPromise = mongoose.model('Semester').findBriefById(semesterId);

  return Promise.join(userPromise, semesterPromise, function(user, semester) {
    if (!user || !semester) return null;

    const now = new Date();
    const schedule = {
      name: name,
      user: user._id,
      semester: semester._id,
      courses: [],
      sections: [],
      public: false,
      created: now,
      lastModified: now
    };

    return mongoose.model('Schedule').create(schedule);
  })
    .then(function(schedule) {
      if (!schedule) return null;
      return mongoose
        .model('Schedule')
        .findBriefByUserAndSemester(userId, semesterId);
    })
    .then(function(schedules) {
      if (!schedules || schedules.length < 1) return null;
      const id = schedules[schedules.length - 1]._id;

      // need to find again to know the _id assigned by mongo!
      return mongoose
        .model('Schedule')
        .findFullByUserAndId(userId, id)
        .then(function(schedule) {
          if (!schedule) return null;

          return {
            selectedSchedule: schedule,
            schedules: schedules
          };
        });
    });
};

scheduleSchema.statics.renameByUserAndId = function(userId, id, name) {
  return this.findOneAndUpdate(
    { _id: id, user: userId },
    { name: name },
    { new: true }
  ).then(function(schedule) {
    if (!schedule) return null;

    return mongoose.model('Schedule').findByUserAndId(userId, id);
  });
};

scheduleSchema.statics.removeByUserAndId = function(userId, id) {
  return this.findOneAndRemove({ _id: id, user: userId }).then(function(
    schedule
  ) {
    if (!schedule) {
      return null;
    }

    return mongoose
      .model('Schedule')
      .findByUserAndSemester(userId, schedule.semester);
  });
};

scheduleSchema.statics.briefSelector = '_id name';
scheduleSchema.statics.findBriefByUserAndSemester = function(
  userId,
  semesterId
) {
  return this.find({
    user: userId,
    semester: semesterId
  })
    .sort({ created: 1 })
    .select(this.briefSelector)
    .lean()
    .exec();
};

scheduleSchema.statics.findByUserAndSemester = function(userId, semesterId) {
  return this.findBriefByUserAndSemester(userId, semesterId).then(function(
    schedules
  ) {
    if (!schedules) return null;
    if (schedules.length === 0) {
      return mongoose
        .model('Schedule')
        .createByUserSemesterAndName(userId, semesterId, 'New Schedule');
    }

    const id = schedules[0]._id;
    return mongoose
      .model('Schedule')
      .findFullByUserAndId(userId, id)
      .then(function(schedule) {
        return {
          schedules: schedules,
          selectedSchedule: schedule
        };
      });
  });
};

scheduleSchema.statics.findByUserAndId = function(userId, id) {
  return this.findFullByUserAndId(userId, id).then(function(schedule) {
    if (!schedule) return;

    return {
      selectedSchedule: schedule
    };
  });
};

scheduleSchema.statics.findFullByUserAndId = function(userId, id) {
  return this.findOne({ _id: id, user: userId })
    .populate({
      path: 'courses',
      select: mongoose.model('Course').minimalSelector,
      populate: {
        path: 'sections'
      }
    })
    .populate({
      path: 'sections',
      select: '_id'
    })
    .lean()
    .exec();
};

scheduleSchema.statics.addCourseByUserAndId = function(userId, id, courseId) {
  return mongoose
    .model('Course')
    .findMinimalById(courseId)
    .then(function(course) {
      if (!course) return null;

      return mongoose
        .model('Schedule')
        .findOneAndUpdate(
          { _id: id, user: userId },
          {
            $set: { lastModified: new Date() },
            $addToSet: { courses: course._id }
          },
          { new: true }
        )
        .then(function(schedule) {
          if (!schedule) return null;

          return mongoose.model('Schedule').findFullByUserAndId(userId, id);
        });
    })
    .then(function(schedule) {
      if (!schedule) return null;
      return {
        selectedSchedule: schedule
      };
    });
};

scheduleSchema.statics.removeCourseByUserAndId = function(
  userId,
  id,
  courseId
) {
  return mongoose
    .model('Course')
    .findMinimalById(courseId)
    .then(function(course) {
      if (!course) return null;

      return mongoose
        .model('Schedule')
        .findOneAndUpdate(
          { _id: id, user: userId },
          {
            $set: { lastModified: new Date() },
            $pull: {
              sections: { $in: course.sections },
              courses: courseId
            }
          },
          { new: true }
        )
        .then(function(schedule) {
          if (!schedule) return null;

          return mongoose.model('Schedule').findFullByUserAndId(userId, id);
        });
    })
    .then(function(schedule) {
      if (!schedule) return null;
      return {
        selectedSchedule: schedule
      };
    });
};

/*
scheduleSchema.statics.findByUserSemester = function(user, semester) {
  return this.find({
    user: user,
    semester: semester
  }).populate('courses sections');
};

scheduleSchema.statics.findFullById = function(id) {
  return this.findById(id).populate('courses sections');
};
*/

const Schedule = mongoose.model('Schedule', scheduleSchema);

// Export the Schedule model
module.exports = Schedule;
