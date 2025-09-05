const mongoose = require('mongoose');

const collegeSchema = mongoose.Schema({
  name: String,
  location: String,
  minRank: Number,
  maxRank: Number,
  branch: String,
});

module.exports = mongoose.model('College', collegeSchema);
