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

//
// HELPER FUNCTIONS

// removes unnecessary whitespace
const clean = function(string) {
  return string.trim().replace(/\s+/g, ' ');
};

// query helper to return a promise with a full, lean schedule
scheduleSchema.query.getFullAndExec = function() {
  return this.populate({
    path: 'courses',
    select: mongoose.model('Course').minimalSelector,
    populate: { path: 'sections' }
  })
    .lean()
    .exec();
};

// returns a promise with an array of brief, lean schedules
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

//
// API FUNCTIONS

scheduleSchema.statics.createByUserSemesterAndName = function(
  userId,
  semesterId,
  name
) {
  // check that user and semester both exist and that name is valid
  const userPromise = mongoose.model('User').count({ _id: userId }).exec();
  const semesterPromise = mongoose
    .model('Semester')
    .count({ _id: semesterId })
    .exec();
  const cleanName = clean(name);

  return Promise.join(userPromise, semesterPromise, function(
    userCount,
    semesterCount
  ) {
    if (!userCount || !semesterCount || !cleanName) return null;

    // create new schedule object
    const now = new Date();

    const schedule = {
      name: cleanName,
      user: userId,
      semester: semesterId,
      courses: [],
      sections: [],
      public: false,
      created: now,
      lastModified: now
    };

    // insert new schedule and retrieve
    return mongoose
      .model('Schedule')
      .findOneAndUpdate({ name: '' }, schedule, { upsert: true, new: true })
      .getFullAndExec();
  }).then(function(schedule) {
    if (!schedule) return null;

    // retrieve new list of schedules
    return mongoose
      .model('Schedule')
      .findBriefByUserAndSemester(userId, semesterId)
      .then(function(schedules) {
        if (!schedules) return null;

        return { selectedSchedule: schedule, schedules: schedules };
      });
  });
};

scheduleSchema.statics.renameByUserAndId = function(userId, scheduleId, name) {
  const cleanName = clean(name);

  return this.findOneAndUpdate(
    { _id: scheduleId, user: userId },
    { name: cleanName },
    { new: true }
  )
    .getFullAndExec()
    .then(function(schedule) {
      if (!schedule) return null;
      return { selectedSchedule: schedule };
    });
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

    const scheduleId = schedules[0]._id;
    return mongoose
      .model('Schedule')
      .findOne({ _id: scheduleId, user: userId })
      .getFullAndExec()
      .then(function(schedule) {
        if (!schedule) return null;
        return { schedules: schedules, selectedSchedule: schedule };
      });
  });
};

scheduleSchema.statics.findByUserAndId = function(userId, scheduleId) {
  return this.findOne({ _id: scheduleId, user: userId })
    .getFullAndExec()
    .then(function(schedule) {
      if (!schedule) return;
      return { selectedSchedule: schedule };
    });
};

scheduleSchema.statics.deleteByUserAndId = function(userId, scheduleId) {
  return this.findOneAndRemove({ _id: scheduleId, user: userId }).then(function(
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

scheduleSchema.statics.addCourseByUserAndId = function(
  userId,
  scheduleId,
  courseId
) {
  return mongoose
    .model('Course')
    .count({ _id: courseId })
    .then(function(count) {
      if (!count) return null;

      return mongoose
        .model('Schedule')
        .findOneAndUpdate(
          { _id: scheduleId, user: userId },
          {
            $set: { lastModified: new Date() },
            $addToSet: { courses: courseId }
          },
          { new: true }
        )
        .getFullAndExec();
    })
    .then(function(schedule) {
      if (!schedule) return null;
      return { selectedSchedule: schedule };
    });
};

scheduleSchema.statics.removeCourseByUserAndId = function(
  userId,
  scheduleId,
  courseId
) {
  return mongoose
    .model('Course')
    .count({ _id: courseId })
    .then(function(count) {
      if (!count) return null;

      const coursePrefixRegex = '^' + courseId;

      return mongoose
        .model('Schedule')
        .findOneAndUpdate(
          { _id: scheduleId, user: userId },
          {
            $set: { lastModified: new Date() },
            $pull: {
              sections: { $regex: coursePrefixRegex },
              courses: courseId
            }
          },
          { new: true }
        )
        .getFullAndExec();
    })
    .then(function(schedule) {
      if (!schedule) return null;
      return { selectedSchedule: schedule };
    });
};

scheduleSchema.statics.addSectionByUserAndId = function(
  userId,
  scheduleId,
  sectionId
) {
  return mongoose
    .model('Section')
    .count({ _id: sectionId })
    .then(function(count) {
      if (!count) return null;

      const courseId = sectionId.substr(0, 10);
      const sectionPrefixRegex = '^' + sectionId.substr(0, 11);

      return mongoose
        .model('Schedule')
        .findOneAndUpdate(
          { _id: scheduleId, user: userId },
          { $pull: { sections: { $regex: sectionPrefixRegex } } }
        )
        .lean()
        .then(function(schedule) {
          if (!schedule) return null;

          return mongoose
            .model('Schedule')
            .findOneAndUpdate(
              { _id: scheduleId, user: userId },
              {
                $set: { lastModified: new Date() },
                $addToSet: { courses: courseId, sections: sectionId }
              },
              { new: true }
            )
            .getFullAndExec();
        });
    })
    .then(function(schedule) {
      if (!schedule) return null;
      return { selectedSchedule: schedule };
    });
};

scheduleSchema.statics.removeSectionByUserAndId = function(
  userId,
  scheduleId,
  sectionId
) {
  return mongoose
    .model('Section')
    .count({ _id: sectionId })
    .then(function(count) {
      if (!count) return null;

      return mongoose
        .model('Schedule')
        .findOneAndUpdate(
          { _id: scheduleId, user: userId },
          {
            $set: { lastModified: new Date() },
            $pull: {
              sections: sectionId
            }
          },
          { new: true }
        )
        .getFullAndExec();
    })
    .then(function(schedule) {
      if (!schedule) return null;
      return { selectedSchedule: schedule };
    });
};

const Schedule = mongoose.model('Schedule', scheduleSchema);

// Export the Schedule model
module.exports = Schedule;
