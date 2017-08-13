// configures logging for the importers
// should be required once in the main script to configure:
//
// const logger = require.main.require('./importers/log/logger.js');
//
// then in any other scripts used by the main script:
//
// const logger = require('winston') to use in each module
const path = require('path');

const now = new Date().toISOString().replace(/[:.]/g, '-');

const winston = require('winston');
winston.configure({
  transports: [
    new winston.transports.Console({
      name: 'console.info',
      level: 'info',
      colorize: true,
      timestamp: true,
      showLevel: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    }),
    new winston.transports.File({
      name: 'file.debug',
      level: 'debug',
      timestamp: true,
      filename: path.join(__dirname, now + '-importer-debug.log'),
      showLevel: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    }),
    new winston.transports.File({
      name: 'file.warn',
      level: 'warn',
      timestamp: true,
      filename: path.join(__dirname, now + '-importer-warn.log'),
      showLevel: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    })
  ]
});

winston.log('info', 'Logger initialised!');
module.exports = winston;
