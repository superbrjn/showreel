/**
 * TODO:
 * Переписать с бодипарсера на формидабл
 * проверить взаимодействие mongodb и сессии
 */

// grab the user model
var User = require("../models/userModel");

exports.login = function(req, res, next) {
  res.render("login");
};

exports.loginOrRegister = function(req, res, next) {
  User.findOne({ email: req.body.email }, function(err, user) {
    // get user from database
    if (err) return err; // 500 database error

    // user not found, register (or 403)
    if (!user) {
      let user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      });

      user.save(function(err) {
        if (err) {
          if (err.code === 11000) {
            error = "That email is already taken, try another.";
          }

          //res.render('login', { err: err.message }); // 500
          return next(err);
        } else {
          req.session.user = user;
          res.redirect("/dash");
        }
      });
    } else {
      // user found, check password
      if (req.body.password === user.password) {
        //if (user.validPassword(password)) {
        req.session.user = user; //user._id;
        res.redirect("/dash"); // 200 OK
      } else {
        // password not valid
        res.render("login", { error: "Неверный пароль." }); // 403 forbidden
      }
    }
  });
};

exports.logout = function(req, res, next) {
  req.session.destroy();
  res.redirect("/");
};

exports.dashboard = function(req, res, next) {
  res.render("dash", {
    userId: req.session.user
  });
};

/**************************************************/
// if admin - can edit (aproove) posts
/*PostsController.editPost = function(req, res, next) {
  const post = req.body;
  const updPost = {};

  if (post.isDone) {
    updPost.isDone = post.isDone;
  }
  if (post.title) {
    updPost.title = post.title;
  }
  if (!updPost) {
    res.status(400);
    res.json({ error: "Bad Data" });
  } else {
    Post.update({ _id: ObjectId(req.params.id) }, updPost, {}, function(
      err,
      post
    ) {
      // db.posts.update({_id: mongojs.ObjectId(req.params.id)}, updPost, {}, function(err, post){
      if (err) {
        res.send(err);
      }
      res.json(post);
    });
  }
};
*/
