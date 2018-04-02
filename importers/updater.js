/*
  Updates the database at regular intervals.
*/

const SCRAPING_INTERVAL = 1000 * 60 * 60 * 12; // every twelve hours

const updateDatabase = require('./importer.js').updateDatabase;

setTimeout(updateDatabase, 1000 * 60); // scrape a minute after
setInterval(updateDatabase, SCRAPING_INTERVAL);
