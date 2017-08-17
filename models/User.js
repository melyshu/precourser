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

userSchema.statics.createIfNonexistent = function(id) {
  return this.findById(id).select('_id').lean().then(function(user) {
    if (user !== null) return null;

    const now = new Date();

    user = {
      _id: id,
      created: now,
      lastModified: now,
      savedCourses: [],
      savedInstructors: []
    };

    return mongoose.model('User').findByIdAndUpdate(
      user._id,
      user,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );
  }).then(function(user) {
    if (user === null) return;

    return mongoose.model('Semester').find().lean().distinct('_id').then(function(ids) {
      const promises = [];
      for (let i = 0; i < ids.length; i++) {
        const semesterId = ids[i];
        promises.push(
          mongoose.model('Schedule').createByUserSemesterAndName(user._id, semesterId, 'New Schedule')
        );
      }
      return Promise.all(promises);
    });
  });
};

userSchema.statics.findSavedCoursesBySemester = function(id, semester) {
  return this.findById(id).select('savedCourses').lean().then(function(user) {
    if (!user) return [];
    return user.savedCourses;
  }).then(function(ids) {
    return mongoose.model('Course').findBriefByIdsAndSemester(ids, semester);
  });
};

userSchema.statics.saveCourse = function(id, courseId) {
  const userPromise = this.findById(id).select('_id').lean().exec();
  const coursePromise = mongoose.model('Course').findBriefById(courseId);

  return Promise.join(
    userPromise,
    coursePromise,
    function(user, course) {
      if (!user || !course) return null;

      return mongoose.model('User').findByIdAndUpdate(
        id,
        {
          $set: {lastModified: new Date()},
          $addToSet: {savedCourses: course._id}
        }
      ).then(function() {
        return course;
      });
    }
  );
};


userSchema.statics.unsaveCourse = function(id, courseId) {
  const userPromise = this.findById(id).select('_id').lean().exec();
  const coursePromise = mongoose.model('Course').findBriefById(courseId);

  return Promise.join(
    userPromise,
    coursePromise,
    function(user, course) {
      if (!user || !course) return null;

      return mongoose.model('User').findByIdAndUpdate(
        id,
        {
          $set: {lastModified: new Date()},
          $pull: {savedCourses: course._id}
        }
      ).then(function() {
        return course;
      });
    }
  );
};

userSchema.statics.findSavedInstructorsBySemester = function(id, semester) {
  return this.findById(id).select('savedInstructors').lean().then(function(user) {
    if (!user) return [];
    return user.savedInstructors;
  }).then(function(ids) {
    return mongoose.model('Instructor').findBriefByIdsAndSemester(ids, semester);
  });
};

userSchema.statics.saveInstructor = function(id, instructorId) {
  const userPromise = this.findById(id).select('_id').lean().exec();
  const instructorPromise = mongoose.model('Instructor').findBriefById(instructorId);

  return Promise.join(
    userPromise,
    instructorPromise,
    function(user, instructor) {
      if (!user || !instructor) return null;

      return mongoose.model('User').findByIdAndUpdate(
        id,
        {
          $set: {lastModified: new Date()},
          $addToSet: {savedInstructors: instructor._id}
        }
      ).then(function() {
        return instructor;
      });
    }
  );
};

userSchema.statics.unsaveInstructor = function(id, instructorId) {
  const userPromise = this.findById(id).select('_id').lean().exec();
  const instructorPromise = mongoose.model('Instructor').findBriefById(instructorId);

  return Promise.join(
    userPromise,
    instructorPromise,
    function(user, instructor) {
      if (!user || !instructor) return null;

      return mongoose.model('User').findByIdAndUpdate(
        id,
        {
          $set: {lastModified: new Date()},
          $pull: {savedInstructors: instructor._id}
        }
      ).then(function() {
        return instructor;
      });
    }
  );
};

const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
