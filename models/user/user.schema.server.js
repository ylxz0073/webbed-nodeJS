var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  admin: Boolean,
  sections: [String]
}, {collection: 'user'});

module.exports = userSchema;