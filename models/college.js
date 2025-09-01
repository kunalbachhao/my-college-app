const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/college');

const collegeSchema = mongoose.Schema({
  name: String,
  location: String,
  minRank: Number,
  maxRank: Number,
  branch: String,
});

module.exports = mongoose.model('College', collegeSchema);