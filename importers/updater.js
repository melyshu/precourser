/*
  Updates the database at regular intervals.
*/

require('../config.js');
const update = require('./__updateEvals.js');
const SCRAPING_INTERVAL = 1000 * 60 * 60 * 4; // every four hours

update();
setInterval(update, SCRAPING_INTERVAL);

/*
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const updateDatabase = require('./importer.js').updateDatabase;

const SCRAPING_INTERVAL = 1000 * 60 * 60 * 4; // every twelve hours

const loop = () => {
  fs
    .readFileAsync('__updater.log')
    .then(function(content) {
      const lastScraped = new Date(content);
      const now = new Date();

      if (now - lastScraped < SCRAPING_INTERVAL) {
        setTimeout(loop, SCRAPING_INTERVAL + lastScraped - now);
      } else throw Error('rescrape needed');
    })
    .catch(function(err) {
      updateDatabase().then(function() {
        fs.writeFileAsync('__updater.log', new Date());
      });
    });
};

// loop(); // no scraping for now
*/
