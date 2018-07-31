var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');
var userModel = mongoose.model('UserModel', userSchema);

function findUserByCredentials(credentials) {
  return userModel.findOne(credentials, {username: 1});
}

function findUserById(userId) {
  return userModel.findById(userId);
}

function findUserByUsername(username) {
    var result = userModel.findOne({username: username});
    return result;
}

function createUser(user) {
  return userModel.create(user);
}

function deleteUser(userId) {
  return userModel.remove({_id: userId});
}

function findAllUsers() {
  return userModel.find();
}

function updateUser(user) {
    return userModel.findOneAndUpdate(
        {_id: user._id},
        {$set: user},
        {new: true});
}


var api = {
  createUser: createUser,
  findAllUsers: findAllUsers,
  findUserById: findUserById,
  findUserByCredentials: findUserByCredentials,
    updateUser: updateUser,
    findUserByUsername: findUserByUsername,
    deleteUser: deleteUser
};

module.exports = api;