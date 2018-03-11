// The Mongoose Model for a Color object in the database
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const colorSchema = new mongoose.Schema({
  // _id is 6-digit rgb
  _id: { type: String, trim: true, uppercase: true, required: '_id required' },
  name: { type: String, trim: true, required: 'name required' }
});

const COLORS = [
  { _id: '4285F4', name: 'cobalt' },
  { _id: 'F6BF26', name: 'banana' },
  { _id: 'EF6C00', name: 'pumpkin' },
  { _id: '7CB342', name: 'pistachio' },
  { _id: '9E69AF', name: 'amethyst' },
  { _id: '795548', name: 'cocoa' },
  { _id: 'D81B60', name: 'cherry blossom' },
  { _id: '3F51B5', name: 'blueberry' },
  { _id: '0B8043', name: 'basil' }
];

colorSchema.statics.fullSelector = '_id name';

colorSchema.statics.briefSelector = '_id';

// Color.findFull
colorSchema.query.getFullAndExec = function() {
  return this.select(mongoose.model('Color').fullSelector).lean().exec();
};

// Color.generateByIds
colorSchema.query.getBriefAndExec = function() {
  return this.select(mongoose.model('Color').briefSelector).lean().exec();
};

// GET /api/startup
colorSchema.statics.findFull = function() {
  return mongoose.model('Color').find().getFullAndExec().then(function(colors) {
    if (!colors) return null;
    return { colors: colors };
  });
};

// utility
colorSchema.statics.createByIdAndName = function(id, name) {
  const color = {
    _id: id,
    name: name
  };
  return mongoose
    .model('Color')
    .findByIdAndUpdate(id, color, { upsert: true, new: true })
    .getFullAndExec();
};

// ColorRecord.createByScheduleAndCourse
colorSchema.statics.generateByIds = function(colorIds) {
  return mongoose.model('Color').find().distinct('_id').then(function(colors) {
    const colorCount = {};

    for (let i = 0; i < colors.length; i++) {
      colorCount[colors[i]] = 0;
    }

    for (let i = 0; i < colorIds.length; i++) {
      colorCount[colorIds[i]] = (colorCount[colorIds[i]] || 0) + 1;
    }

    let minimum = null;
    for (let colorId in colorCount) {
      if (minimum === null) minimum = colorCount[colorId];
      else
        minimum = minimum < colorCount[colorId] ? minimum : colorCount[colorId];
    }
    let minColors = [];
    for (let colorId in colorCount) {
      if (colorCount[colorId] === minimum) minColors.push(colorId);
    }
    return minColors[Math.floor(Math.random() * minColors.length)];
  });
};

const Color = mongoose.model('Color', colorSchema);

Color.remove({}).then(function() {
  Color.create(COLORS);
});

// Export the Schedule model
module.exports = Color;
