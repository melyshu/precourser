// The Mongoose Model for a User object in the database
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

//const Semester = require('./Semester.js');

const userSchema = new mongoose.Schema({
  _id: { type: String, trim: true, lowercase: true, required: '_id required' },
  created: { type: Date, required: 'created required' },
  lastModified: { type: Date, required: 'lastModified required' },
  savedCourses: [{ type: String, ref: 'Course' }],
  savedInstructors: [{ type: String, ref: 'Instructor' }]
});

userSchema.statics.fullSelector = '';

// User.findFullById
// User.saveCourseById
// User.unsaveCourseById
userSchema.query.getFullAndExec = function() {
  return this.select(mongoose.model('User').fullSelector)
    .populate({
      path: 'savedCourses',
      select: mongoose.model('Course').briefSelector,
      populate: [
        { path: 'sections' },
        {
          path: 'instructors',
          select: mongoose.model('Instructor').minimalSelector
        }
      ]
    })
    .lean()
    .exec();
};

// GET /api/startup
userSchema.statics.findFullById = function(userId) {
  return mongoose
    .model('User')
    .findById(userId)
    .getFullAndExec()
    .then(function(user) {
      if (user) return user;

      // create if nonexistent
      const now = new Date();
      user = {
        _id: userId,
        created: now,
        lastModified: now,
        savedCourses: [],
        savedInstructors: []
      };

      return mongoose
        .model('User')
        .findByIdAndUpdate(userId, user, { upsert: true, new: true })
        .getFullAndExec();
    })
    .then(function(user) {
      if (!user) return null;
      return { user: user };
    });
};

// PUT /api/save/course/:courseId
userSchema.statics.saveCourseById = function(userId, courseId) {
  return mongoose
    .model('Course')
    .count({ _id: courseId })
    .then(function(count) {
      if (!count) return null;

      return mongoose
        .model('User')
        .findOneAndUpdate(
          { _id: userId },
          {
            $set: { lastModified: new Date() },
            $addToSet: { savedCourses: courseId }
          },
          { new: true }
        )
        .getFullAndExec();
    })
    .then(function(user) {
      if (!user) return null;
      return { user: user };
    });
};

// DELETE /api/save/course/:courseId
userSchema.statics.unsaveCourseById = function(userId, courseId) {
  return mongoose
    .model('Course')
    .count({ _id: courseId })
    .then(function(count) {
      if (!count) return null;

      return mongoose
        .model('User')
        .findOneAndUpdate(
          { _id: userId },
          {
            $set: { lastModified: new Date() },
            $pull: { savedCourses: courseId }
          },
          { new: true }
        )
        .getFullAndExec();
    })
    .then(function(user) {
      if (!user) return null;
      return { user: user };
    });
};

const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
