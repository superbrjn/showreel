const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const passport = require('passport');

// NB:
// visitors can Read
// users can Create, Read, Update, Delete <-- users.js
// admins can CRUD + Edit, Premoderate <-- admin.js

/**
*   Data API:
*/

// Show All Posts of My posts
// End-point: http://localhost:3000/posts/posts
router.get('/posts', postsController.list);

// Show Single Post (of specific user or My post)
// End-point: http://localhost:3000/posts/post/:id
router.get('/post/:id', postsController.show);

// Save Single Post (My post)
// End-point: http://localhost:3000/posts/post/
router.post('/post/', passport.authenticate('jwt', { session: false }), postsController.create);
//router.post('/post', postsController.create);
// router.post("/users/:username/post", postsController.create);

// Delete Single Post (My post)
// End-point: http://localhost:3000/posts/post/:id
router.delete('/post/:id', passport.authenticate('jwt', { session: false }), postsController.destroy);

// Update Single Post (My post)
// End-point: http://localhost:3000/posts/post/:id
router.put('/post/:id', passport.authenticate('jwt', { session: false }), postsController.update);

/*
// use passport instead
checkAuth () => {
  if (req.isAuthenticated) { // if loggedin
    Post.findById(req.params.id, function(err, post) { // find post
      // if this user is an author or admin
      if (post.author.id.equals(req.user.id) || req.user.isAdmin) {
        next();
      } else {
        err throw err
      }
    })
  }
}
*/
module.exports = router;
