const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name:  String,
  email: String,
  password: String,
  age: Number,
  predictions: [{
    rank: Number,
    colleges: [String]  // Store college names or IDs
  }]
});

module.exports = mongoose.model('User', userSchema);
