const User = require("../models/user.js");
const mongoose = require("mongoose");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const UsersController = {};
// NB:
// visitors can Read only <-- visitors.js
// users can Create, Read, Update, Delete <-- users.js
// admins can CRUD + Edit, Premoderate <-- users.js

/**
*   ==== Authentication API ====
*/

// puts new user in database
// End-point: http://localhost:3000/users/register
UsersController.register = (req, res, next) => { // create
  console.log("API route registerUser fn in work.");
  //console.log("user: ", user);
  console.log("Server URL of route is: ", req.route);
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password, // plain text password from html form
  });
  console.log("newUser is: ", newUser);

  // hash password before db, and save user to it
  User.addUser(newUser, (err, user) => {
    console.log("API route fn addUser in work again.");
    console.log("Saved user is: ", user);
    if (err) {
      res.json({ success: false, msg: 'Faild to register new user.' });
    } else {
      res.json({ success: true, msg: 'User registered.' });
    }
  });

  // put auth-func here for autologin
};

// gives back a token
// End-point: http://localhost:3000/users/auth
UsersController.auth = (req, res, next) => { // login
  // take input data from html
  const username = req.body.username;
  const password = req.body.password;

  // compare this data with db data
  User.getUserByUsername(username, (err, user) => { // this 'user' is from db
    // this fn in model, user found or not
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: 'User not found.' });
    }

    // user found:
    User.comparePassword(password, user.password, (err, isMatch) => { // <-- candidatePassword, actual hash, cb
      // this fn is in model, our reaction to result of it
      if (err) throw err;
      if (isMatch) {
        // pass match, and we create token
        const token = jwt.sign({ data:/*payload:*/ user }, config.secret, { // creates jwt_payload, puts user in data
          expiresIn: 604800, // 1 week
        });

        // user found and password matched, our response is: send this to client (Angular - LocalStorage):
        res.json({
          success: true,
          token: 'JWT ' + token,
          // instead of sending data with password, we build new object without it
          user: { // this data are from db:
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
          },
        });
      } else {
        return res.json({ success: false, msg: 'Wrong password. Try Harder.' });
      }
    });
  });
};

// End-point: http://localhost:3000/users/profile
UsersController.profile = (req, res, next) => { // read
  res.json({ user: req.user });
};

/**
*   =============================
*   ==== Profile/Account API ====
*   =============================
*/

// dashboard
UsersController.showPostsOfFollowingUsers = (req, res, next) => {
  //if(req.params.username !== req.user.username) {
    //return res.json({'error': 'You are not allowed to see another user\'s dashboard'}, 403);
  //}

  //User.findOne({'username': req.user.username}, function(err, user) {
  User.getUserByUsername(user.username, (err, user) => { // <-- perhaps unnessesory becouse of auth token
    if (err) {
      console.log('There was an error while loading data from the database: ', err);
      return res.json({'error': 'Couldn\'t load user'}, 500);
    }

    if (!user) {
      console.log('No user with this username where found');
      return res.json({'error': 'Couldn\'t load user'}, 500);
    }

    // assamble Following users
    const idList = [user.id];
    for(let i = 0; i < user.following.length; i++) {
      idList.push(user.following[i].userId);
    }

    // get posts of following users, sorted by date
    Post.find().where('author.userId').in(idList).sort({'created': -1}).exec(function (err, posts) { // async func
      if(err) {
        console.log('There was an error while loading data from the database: ', err);
        return res.json({'error': 'Couldn\'t load posts for the user dashboard'}, 500);
      }
      res.json({'posts': posts});
    });
  });
};

// Edit profile
UsersController.editProfile = function (req, res) { // update
    //User.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body, (err, user) => {
    User.updateUserById(user.id, req.body, (err, user) => {
      if (err) { return console.error(err); }
      //res.status(200);
      res.json(user);
    });
};

// Delete User
UsersController.destroyUser = function (req, res) {
  //User.findOneAndRemove({ _id: ObjectId(req.params.id) }, (err, user) => {
  User.deleteUser(user.id, (err, user) => { // LS token user.id = user._id
      if (err) { return console.error(err); }
      //res.status(200);
      res.json(user);
    });
};

/**
*   ===================================
*   ==== User Interaction Data API ====
*   ===================================
*/

// List all users with following/followers
UsersController.listUsers = (req, res) => {
  if (user.username !== null) {
  //User.findOne({'username': req.user.username}, function (err, user) {
  User.getUserByUsername(user.username, function (err, user) {
    if (err) {
      console.log('There was an error while loading data from the database: ', err);
      return res.json({'error': 'Couldn\'t load user'}, 500);
    }
    if (!user) {
      console.log('No user with this username was not found');
      return res.json({'error': 'Couldn\'t load user'}, 500);
    }

    const followerMap = {};
    for (let i = 0; i < user.following.length; i++) {
      followerMap[user.following[i].userId] = 1;
    }

    User.find({}, {'username': 1, 'name': 1}, { 'sort': {'username': 1} }, function (err, users) {
      if (err) {
        console.log('There was an error while loading data from the database: ', err);
        return res.json({'error': 'Couldn\'t load user'}, 500);
      }

      for (let i = 0; i < users.length; i++) {
        if (users[i].id in followerMap) {
          users[i].follow = true;
        } else {
          users[i].follow = false;
        }
        users[i] = users[i].toObject({ virtuals: false });
      }

      res.json({'users': users});
    });
  });

  // index users
  } else {
    User.find({}, function (err, users) {
      if (err) { res.json(err); }
      res.json(users);
    });
  }
};

// Отобразить выбранного пользователя
/*UsersController.show = function (req, res) {
    User.find({"username": req.params.username}, function (err, result) {
      if (err) {
        console.log(err);
        res.send(500, err); // ошибка базы данных
      } else if (result.length !== 0) { // если мы нашли пользователя
        res.sendfile("../client/public/index.html"); // отправляем базовый файл HTML, представляющий отображение
      } else { // если пользователя с таким именем не существует
        res.send(404); // возвращаем ошибку 404
      }
    });
};

UsersController.show = function (req, res) {
  const username = req.params.username; // может не сработать потому что страницы не меняются из-за аякса

  // compare this data with db data
  User.getUserByUsername(username, (err, user) => { // this 'user' is from db
    // this fn in model, user found or not
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: 'User not found.' });
    }
  });
};
*/
// SomeoneProfile
/*UsersController.username = function (req, res) {
  User.find({ "_id": req.params.id }, function (err, users) {
    if (err) { return console.error(err); }
    res.json(users[0].username);
  });
};*/
// Show single user by id
UsersController.showSelectedUser = (req, res) => {
  User.findOne({ _id: ObjectId(req.params.id) }, (err, user) => {
    if (err) { return console.error(err); }
    res.json(user);
    //res.json({'user': user});
  });
};

/**
*   ====================
*   ==== Follow API ====
*   ====================
*/

// C
UsersController.follow = (req, res) => {
  User.findOne({'username': req.params.username}, {'id': 1, 'username': 1, 'name': 1}, function (err, following) {
    if (err) {
      console.log('There was an error while loading data from the database: ', err);
      return res.json({'error': 'Couldn\'t load user'}, 500);
    }
    if (!following) {
      console.log('No user with this username was not found');
      return res.json({'error': 'Couldn\'t load user'}, 500);
    }
    if (req.user.id === following.id) {
      return res.json({'error': 'You can\'t follow your self'}, 500);
    }

    User.update({'_id': req.user.id}, {'$push': { following: { userId: following.id, 'username': following.username, 'name': following.name } } }, function (err, numberAffected, raw) {
      if(err) {
        console.log('Couldn\'t save user');
        return res.json({'error': 'Couldn\'t save user'}, 500);
      }

      console.log('The user with id ' + req.user.id + ' follow now the user with id ' + following.id);
      return res.json({'successful': true});
    });
  });
};

// D
UsersController.unfollow = (req, res) => {
  User.findOne({'username': req.params.username}, {'id': 1, 'username': 1, 'name': 1}, function (err, following) {
			if (err) {
				console.log('There was an error while loading data from the database: ', err);
				return res.json({'error': 'Couldn\'t load user'}, 500);
			}
			if (!following) {
				console.log('No user with this username was not found');
				return res.json({'error': 'Couldn\'t load user'}, 500);
			}
			if (req.user.id === following.id) {
				return res.json({'error': 'You can\'t unfollow your self'}, 500);
			}

			User.update({'_id': req.user.id}, {'$pull': { following: { userId: following.id } } }, function (err, numberAffected, raw) {
				if(err) {
					console.log('Couldn\'t save user');
					return res.json({'error': 'Couldn\'t save user'}, 500);
				}

				console.log('The user with id ' + req.user.id + ' unfollowed the user with id ' + following.id);
				return res.json({'successful': true});
			});
	});
};

//UsersController.showFollowers = (req, res) => {}; <-- implemented in other actions
//UsersController.showWhoFollowing = (req, res) => {}; <-- implemented in other actions

module.exports = UsersController;
