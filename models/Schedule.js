// The Mongoose Model for a Schedule object in the database
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

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

// removes unnecessary whitespace
const clean = function(string) {
  return string.trim().replace(/\s+/g, ' ');
};

scheduleSchema.statics.fullSelector = '-public';

// Schedule.findByUserAndSemester
// Schedule.findByUserAndId
// Schedule.createByUserSemesterAndName
// Schedule.renameByUserAndId
// Schedule.addCourseByUserAndId
// Schedule.removeCourseByUserAndId
// Schedule.addSectionByUserAndId
// Schedule.removeSectionByUserAndId
scheduleSchema.query.getFullAndExec = function() {
  return this.select(mongoose.model('Schedule').fullSelector)
    .populate({
      path: 'courses',
      select: mongoose.model('Course').briefSelector,
      populate: { path: 'sections' }
    })
    .lean()
    .exec();
};

scheduleSchema.statics.briefSelector = '_id name';

// Schedule.findByUserAndSemester
// Schedule.createByUserSemesterAndName
scheduleSchema.statics.findBriefByUserAndSemester = function(
  userId,
  semesterId
) {
  return mongoose
    .model('Schedule')
    .find({ user: userId, semester: semesterId })
    .sort({ lastModified: -1 })
    .select(mongoose.model('Schedule').briefSelector)
    .lean()
    .exec();
};

// GET /api/startup
// GET /api/semester/:semesterId
// Schedule.deleteByUserAndId
scheduleSchema.statics.findByUserAndSemester = function(userId, semesterId) {
  return mongoose
    .model('Schedule')
    .findBriefByUserAndSemester(userId, semesterId)
    .then(function(schedules) {
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

          return {
            selectedSemester: semesterId,
            schedules: schedules,
            selectedSchedule: schedule
          };
        });
    });
};

// GET /api/schedule/:scheduleId
scheduleSchema.statics.findByUserAndId = function(userId, scheduleId) {
  return mongoose
    .model('Schedule')
    .findOne({ _id: scheduleId, user: userId })
    .getFullAndExec()
    .then(function(schedule) {
      if (!schedule) return;
      return { selectedSchedule: schedule };
    });
};

// POST /api/schedule/:scheduleId/name/:name
// Schedule.findByUserAndSemester
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

// PUT /api/schedule/:scheduleId/name/:name
scheduleSchema.statics.renameByUserAndId = function(userId, scheduleId, name) {
  const cleanName = clean(name);

  return mongoose
    .model('Schedule')
    .findOneAndUpdate(
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

// DELETE /api/schedule/:scheduleId
scheduleSchema.statics.deleteByUserAndId = function(userId, scheduleId) {
  return mongoose
    .model('Schedule')
    .findOneAndRemove({ _id: scheduleId, user: userId })
    .then(function(schedule) {
      if (!schedule) return null;

      return mongoose
        .model('Schedule')
        .findByUserAndSemester(userId, schedule.semester);
    });
};

// PUT /api/schedule/:scheduleId/course/:courseId
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

      const semesterId = courseId.substr(0, 4);

      return mongoose
        .model('Schedule')
        .findOneAndUpdate(
          { _id: scheduleId, user: userId, semester: semesterId },
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

// DELETE /api/schedule/:scheduleId/course/:courseId
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

// PUT /api/schedule/:scheduleId/section/:sectionId
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

      const semesterId = sectionId.substr(0, 4);
      const courseId = sectionId.substr(0, 10);
      const sectionPrefixRegex = '^' + sectionId.substr(0, 11);

      // first remove any conflicting sections
      return mongoose
        .model('Schedule')
        .findOneAndUpdate(
          { _id: scheduleId, user: userId, semester: semesterId },
          {
            $set: { lastModified: new Date() },
            $pull: { sections: { $regex: sectionPrefixRegex } }
          }
        )
        .lean()
        .then(function(schedule) {
          if (!schedule) return null;

          // then add the desired section
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

// DELETE /api/schedule/:scheduleId/section/:sectionId
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
            $pull: { sections: sectionId }
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
