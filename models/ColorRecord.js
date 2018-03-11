// The Mongoose Model for a ColorRecord object in the database
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const colorRecordSchema = new mongoose.Schema({
  /* _id: { type: mongoose.Schema.Types.ObjectId }, */
  schedule: { type: String, ref: 'Schedule', required: 'schedule required' },
  course: { type: String, ref: 'Course', required: 'course required' },
  color: { type: String, ref: 'Color', required: 'color required' }
});

colorRecordSchema.statics.fullSelector = '-_id course color';

// ColorRecord.createByScheduleAndCourse
// ColorRecord.createByScheduleCourseAndColor
colorRecordSchema.query.getFullAndExec = function() {
  return this.select(mongoose.model('ColorRecord').fullSelector).lean().exec();
};

// Schedule.addCourseByUserAndId
// Schedule.addSectionByUserAndId
colorRecordSchema.statics.createByScheduleAndCourse = function(
  scheduleId,
  courseId
) {
  const schedulePromise = mongoose.model('Schedule').count({ _id: scheduleId });
  const coursePromise = mongoose.model('Course').count({ _id: courseId });
  const colorRecordPromise = mongoose
    .model('ColorRecord')
    .count({ schedule: scheduleId, course: courseId });

  return Promise.join(
    schedulePromise,
    coursePromise,
    colorRecordPromise,
    function(scheduleCount, courseCount, colorRecordCount) {
      if (!scheduleCount || !courseCount) return null;

      if (colorRecordCount)
        return mongoose
          .model('ColorRecord')
          .findOne({ schedule: scheduleId, course: courseId })
          .getFullAndExec();

      return mongoose
        .model('ColorRecord')
        .find({ schedule: scheduleId })
        .distinct('color')
        .then(function(colorIds) {
          return mongoose.model('Color').generateByIds(colorIds);
        })
        .then(function(colorId) {
          return mongoose
            .model('ColorRecord')
            .findOneAndUpdate(
              { schedule: scheduleId, course: courseId },
              {
                schedule: scheduleId,
                course: courseId,
                color: colorId
              },
              { upsert: true, new: true }
            )
            .getFullAndExec();
        });
    }
  );
};

// Schedule.changeCourseColor
colorRecordSchema.statics.createByScheduleCourseAndColor = function(
  scheduleId,
  courseId,
  colorId
) {
  const schedulePromise = mongoose.model('Schedule').count({ _id: scheduleId });
  const coursePromise = mongoose.model('Schedule').count({ _id: courseId });
  const colorPromise = mongoose.model('Color').count({ _id: colorId });

  return Promise.join(schedulePromise, coursePromise, colorPromise, function(
    scheduleCount,
    courseCount,
    colorCount
  ) {
    if (!scheduleCount || !courseCount || !colorCount) return null;

    return mongoose
      .model('ColorRecord')
      .findOneAndUpdate(
        { schedule: scheduleId, course: courseId },
        {
          schedule: scheduleId,
          course: courseId,
          color: colorId
        },
        { upsert: true, new: true }
      )
      .getFullAndExec();
  });
};

const ColorRecord = mongoose.model('ColorRecord', colorRecordSchema);

// Export the ColorRecord model
module.exports = ColorRecord;
