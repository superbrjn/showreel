const User = require("../models/user.js");
const Post = require("../models/user.js");
const mongoose = require("mongoose");

/**
*   Admin Authentication API:
*/
AdminController.register = (req, res, next) => {
  /*
    // passport-local-mongoose: Convenience method to register a new user instance with a given password. Checks if username is unique
    User.register(new User({
      email: req.body.email
    }), req.body.password, function (err, user) {
          if (err) {
            console.error(err);
            return;
          }

          // log the user in after it is created
          passport.authenticate('local')(req, res, function () {
            console.log('authenticated by passport');
            res.redirect('/admin/dashboard');
          });
      });
  */
      let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password, // plain text password from html form
      });

      if (req.body.adminCode === 'admin123') {
        newUser.isAdmin = true;
      }

      // hash password before db, and save user to it
      User.addUser(newUser, (err, user) => {

        if (err) {
          res.json({ success: false, msg: 'Faild to register new user.' });
        } else {
          res.json({ success: true, msg: 'User registered.' });
        }

      });
};

AdminController.login = (req, res, next) => {
  res.redirect('/admin/dashboard');
};

AdminController.dash = (req, res, next) => {
  //res.render('admin/dashboard', { user: req.user} );
  res.json({ user: req.user});
};

/**
*   (Admin) Moderation API:
*/

/*
// Aproove post of user
// End-point: http://localhost:3000/users/users/:username/post/:id
router.post("/users/:username/post/:id", authenticate, postsController.aproove);

// Edit post of user
// End-point: http://localhost:3000/users/users/:username/post/:id
router.put("/users/:username/post/:id", authenticate, postsController.edit);

// Delete single post of user / unaproove
// End-point: http://localhost:3000/users/users/:username/post/:id
router.del("/users/:username/post/:id", authenticate, postsController.suppress);

// Ban === Delete user profile (and all his posts)
// End-point: http://localhost:3000/users/users/:username
router.del("/users/:username", authenticate, UsersController.ban);
*/

module.exports.AdminController = AdminController;
