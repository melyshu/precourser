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
/*
userSchema.query.getFullAndExec = function() {
  return this.populate({
    path: 'savedCourses',
    select: mongoose.model('Course').briefSelector,
    populate: { path: 'sections' }
  })
    .lean()
    .exec();
};*/

userSchema.query.getFullBySemesterAndExec = function(semesterId) {
  return this.populate({
    path: 'savedCourses',
    match: { semester: semesterId },
    select: mongoose.model('Course').briefSelector,
    populate: { path: 'sections' }
  })
    .lean()
    .exec();
};
/*
userSchema.statics.findFullById = function(userId) {
  return this.findById(userId).getFullAndExec().then(function(user) {
    if (!user) return null;
    return { user: user };
  });
};*/

userSchema.statics.findFullBySemester = function(userId, semesterId) {
  return this.findById(userId)
    .getFullBySemesterAndExec(semesterId)
    .then(function(user) {
      if (!user) return null;
      return { user: user };
    });
};

userSchema.statics.saveCourseBySemester = function(
  userId,
  courseId,
  semesterId
) {
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
        .getFullBySemesterAndExec(semesterId);
    })
    .then(function(user) {
      if (!user) return null;
      return { user: user };
    });
};

userSchema.statics.unsaveCourseBySemester = function(
  userId,
  courseId,
  semesterId
) {
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
        .getFullBySemesterAndExec(semesterId);
    })
    .then(function(user) {
      if (!user) return null;
      return { user: user };
    });
};

userSchema.statics.createIfNonexistent = function(id) {
  return this.findById(id)
    .select('_id')
    .lean()
    .then(function(user) {
      if (user !== null) return null;

      const now = new Date();

      user = {
        _id: id,
        created: now,
        lastModified: now,
        savedCourses: [],
        savedInstructors: []
      };

      return mongoose.model('User').findByIdAndUpdate(user._id, user, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      });
    })
    .then(function(user) {
      if (user === null) return;

      return mongoose
        .model('Semester')
        .find()
        .lean()
        .distinct('_id')
        .then(function(ids) {
          const promises = [];
          for (let i = 0; i < ids.length; i++) {
            const semesterId = ids[i];
            promises.push(
              mongoose
                .model('Schedule')
                .createByUserSemesterAndName(
                  user._id,
                  semesterId,
                  'New Schedule'
                )
            );
          }
          return Promise.all(promises);
        });
    });
};
/*
userSchema.statics.findSavedCoursesBySemester = function(id, semester) {
  return this.findById(id)
    .select('savedCourses')
    .lean()
    .then(function(user) {
      if (!user) return [];
      return user.savedCourses;
    })
    .then(function(ids) {
      return mongoose.model('Course').findBriefByIdsAndSemester(ids, semester);
    });
};

userSchema.statics.saveCourse = function(userId, courseId) {
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

userSchema.statics.unsaveCourse = function(userId, courseId) {
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

userSchema.statics.findSavedInstructorsBySemester = function(id, semester) {
  return this.findById(id)
    .select('savedInstructors')
    .lean()
    .then(function(user) {
      if (!user) return [];
      return user.savedInstructors;
    })
    .then(function(ids) {
      return mongoose
        .model('Instructor')
        .findBriefByIdsAndSemester(ids, semester);
    });
};

userSchema.statics.saveInstructor = function(id, instructorId) {
  const userPromise = this.findById(id).select('_id').lean().exec();
  const instructorPromise = mongoose
    .model('Instructor')
    .findBriefById(instructorId);

  return Promise.join(userPromise, instructorPromise, function(
    user,
    instructor
  ) {
    if (!user || !instructor) return null;

    return mongoose
      .model('User')
      .findByIdAndUpdate(id, {
        $set: { lastModified: new Date() },
        $addToSet: { savedInstructors: instructor._id }
      })
      .then(function() {
        return instructor;
      });
  });
};

userSchema.statics.unsaveInstructor = function(id, instructorId) {
  const userPromise = this.findById(id).select('_id').lean().exec();
  const instructorPromise = mongoose
    .model('Instructor')
    .findBriefById(instructorId);

  return Promise.join(userPromise, instructorPromise, function(
    user,
    instructor
  ) {
    if (!user || !instructor) return null;

    return mongoose
      .model('User')
      .findByIdAndUpdate(id, {
        $set: { lastModified: new Date() },
        $pull: { savedInstructors: instructor._id }
      })
      .then(function() {
        return instructor;
      });
  });
};*/

const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
