const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/college');

const userSchema = mongoose.Schema({
    name:  String,
    email: String,
    password: String,
    age: Number
});

predictions: [{
  rank: Number,
  colleges: [String]  // Store college names or IDs
}]

module.exports = mongoose.model('User',userSchema);