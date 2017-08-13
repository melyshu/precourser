require('../config.js');
const logger = require('./log/logger.js');
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const Course = require('../models/Course.js');
const Department = require('../models/Department.js');

logger.log('info', 'detectNewDepartments: Detecting new departments...');
Department.find().lean().distinct('_id').then(function(currentDepartments) {
  const newDepartments = [];

  const listedDepartments = Course.find()
    .lean()
    .distinct('department')
    .then(function(departments) {
      for (let i = 0; i < departments.length; i++) {
        const department = departments[i];
        if (
          currentDepartments.indexOf(department) < 0 &&
          newDepartments.indexOf(department) < 0
        )
          newDepartments.push(department);
      }
    });

  const crossListedDepartments = Course.find()
    .lean()
    .distinct('crossListings.department')
    .then(function(departments) {
      for (let i = 0; i < departments.length; i++) {
        const department = departments[i];
        if (
          currentDepartments.indexOf(department) < 0 &&
          newDepartments.indexOf(department) < 0
        )
          newDepartments.push(department);
      }
    });

  return Promise.join(listedDepartments, crossListedDepartments, function() {
    logger.log(
      'info',
      'detectNewDepartments: Finished detecting new departments'
    );
    logger.log(
      'info',
      'detectNewDepartments: There are %d new departments:',
      newDepartments.length
    );
    logger.log(
      'info',
      'detectNewDepartments: %s',
      JSON.stringify(newDepartments, null, 2)
    );
  });
});
