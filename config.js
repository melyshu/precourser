// Handles configuration information for a lot of modules

// load environment variables for development
require('dotenv').config({ path: '.env' });

// database uri
const mongoDbUri = process.env.MONGODB_URI;
if (mongoDbUri === undefined) {
  console.error(
    'Please specify a mongoDB URI in the MONGODB_URI configuration variable.'
  );
  process.exit(1);
}
module.exports.mongoDbUri = mongoDbUri;

// database connection
const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose
  .connect(process.env.MONGODB_URI, {
    useMongoClient: true
  })
  .then(function() {
    console.log('Connected successfully to the database.');
  })
  .catch(function(err) {
    console.error(
      'Did not connect successfully to the database. Please Retry.'
    );
    console.error(err);
    process.exit(1);
  });

// domain and port
const host = process.env.HOST || 'http://localhost:4000';
const port = process.env.PORT || 4000;
module.exports.host = host;
module.exports.port = port;
