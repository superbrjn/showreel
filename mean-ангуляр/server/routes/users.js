const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/usersController');
const passport = require('passport');
const postsController = require('../controllers/postsController');

// NB:
// visitors can Read only <-- visitors.js
// users can Create, Read, Update, Delete <-- users.js
// admins can CRUD + Edit, Premoderate <-- users.js

/**
*   Authentication API
*/

// Register
// puts new user in database
// End-point: http://localhost:3000/users/register
router.post('/register', UsersController.register);

// Authenticate - Login
// gives back a token
// End-point: http://localhost:3000/users/auth
router.post('/auth', UsersController.auth);

// My profile -- protected route // +add toglle protection as a feature
// asks for token to pass by
// End-point: http://localhost:3000/users/profile
router.get('/profile', passport.authenticate('jwt', { session: false }), UsersController.profile);

/**
*   Account API (profile)
*/

// Create profile
// End-point: http://localhost:3000/users/register
//router.post("/users", usersController.create); // <-- /register

// End-point: http://localhost:3000/users/profile/dashboard
// End-point: http://localhost:3000/users/users/:username/dashboard
router.get('/dashboard', passport.authenticate('jwt', { session: false }), UsersController.showPostsOfFollowingUsers);


// Edit profile
// End-point: http://localhost:3000/users/users/:username
//router.put("/users/:username", UsersController.update);
// End-point: http://localhost:3000/users/profile
router.put('/profile', passport.authenticate('jwt', { session: false }), UsersController.editProfile);

// Delete User (profile and all data)
// End-point: http://localhost:3000/users/users/:username
//router.del("/users/:username", UsersController.destroy);
// End-point: http://localhost:3000/users/profile
router.put('/profile', passport.authenticate('jwt', { session: false }), UsersController.destroyUser);

/**
*   User Interaction Data API (dashboard)
*/

// Show all user profiles with followers/following
// End-point: http://localhost:3000/users/users
//router.get("/users", UsersController.list); // not protected
router.get("/", UsersController.listUsers); // not protected

// Show specific user profile
// End-point: http://localhost:3000/users/users/:username --> /profile/:id
//router.get("/users/:username", UsersController.show); // not protected
router.get("/", UsersController.showSelectedUser);

// Show all posts of specific user
// End-point: http://localhost:3000/users/users/:username/posts
//router.get("/users/:username/posts", postsController.index); // not protected
router.get("/profile/:username/posts", postsController.listPosts); // not protected

/**
*   Follow API:
*/

// C
router.put("/users/:username/follow", passport.authenticate('jwt', { session: false }), UsersController.follow);
// D
router.put("/users/:username/unfollow", passport.authenticate('jwt', { session: false }), UsersController.unfollow);

// End-point: http://localhost:3000/users/users/:username/followers/:id
// R show  followController.showFollowers
// End-point: http://localhost:3000/users/users/:username/following/:id
// R show  followController.showWhoFollowing


/**
*  Public/unprotected API for Visitors (frontpage):
   - auth guard on client -
*/
/*
// Show All Posts of all users
// End-point: http://localhost:3000/visitors/posts
router.get('/posts', postsController.index);

// Show Single Post (of specific user)
// End-point: http://localhost:3000/visitors/post/:id
router.get('/post/:id', postsController.show);

// Show all user profiles
// End-point: http://localhost:3000/visitors/users
router.get("/users", usersController.index);

// Show specific user profile
// End-point: http://localhost:3000/visitors/users/:username
router.get("/users/:username", usersController.show);
*/
module.exports = router;
