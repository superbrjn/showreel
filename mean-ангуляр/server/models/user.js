const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const UserSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String, lowercase: true, required: true },
  username: { type: String, lowercase: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  // roles: { type: String, enum: ['admin', 'user', 'moderator', 'member', 'securedUser'] },
  following: [{
    userId: { type: Schema.Types.ObjectId, required: true },
    username: String,
    name: String,
  }],
  _follow: Boolean,
});

UserSchema.virtual('follow')
	.set(function (follow) {
		this._follow = follow;
	})
	.get(function () {
		return this._follow;
	});

const User = module.exports = mongoose.model('User', UserSchema);

/**
* Basic Utility Functions:
*/

module.exports.getUserById = function (id, callback) {
  console.log("UserModel retrieving user by id from DB...");
  User.findById(id, callback);
};

// find user in database
module.exports.getUserByUsername = function (username, callback) {
  console.log("UserModel quering user from DB...");
  const query = { username: username };
  User.findOne(query, callback);
};

// save user to database
module.exports.addUser = function (newUser, callback) {
  console.log("UserModel fn addUser in work...");
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      console.log("bcrypt hashing in work...");
      console.log("newUser password is: ", newUser.password);
      // if (err) throw err; // Error: Illegal arguments: undefined, string
      if (err) {
        console.error(err.stack);
      }

      newUser.password = hash;
      newUser.save(callback); // сохр в бд
      console.log("New user should be saved in database!");
    });
  });
};

module.exports.comparePassword = function (candidatePassword, hash, callback) { // html form pass, db user.pass, cb
  // incapsulated fn
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch); // all good, launch isMatch parameter of cb
  });
};

// Edit/Update
module.exports.updateUserById = function (id, callback) {
  //const query = { id: _id };
  User.findOneAndUpdate(id, req.body, callback);
};

// Delte user and all data
module.exports.deleteUser = function (id, callback) {
  User.findOneAndRemove(id, callback);
};
