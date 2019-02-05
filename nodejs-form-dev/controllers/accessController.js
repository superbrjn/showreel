let User = require("../models/userModel");
//let app = require("../app");

exports.authorize = function(req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({ email: req.session.user.email }, "email", function(
      err,
      user
    ) {
      // if a user was found, make the user available
      if (user) {
        //app.createUserSession(req, res, user);
        req.user = user;
        delete req.user.password;
        req.session.user = req.user; // update the session info
        req.locals.user = req.user; // make user available to templates
      }

      next();
    });
  } else {
    next(); // if no session available, do nothing
  }
};

exports.requireLogin = function(req, res, next) {
  // if this user isn't Logged in, redirect to the Login page
  if (!req.user) {
    res.redirect("/login");

    // if the user is Logged in, Let him pass
  } else {
    next();
  }
};
