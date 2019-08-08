const Post = require("../models/post.js");
const User = require("../models/user.js");//.User;

const PostsController = {};
// NB Sort posts by:
// username, email, DateOfCreate (default option - newest on top),
// all posts must be premoderated


/**
* RESTful API:
*/

// Get All Posts
/*PostsController.index = function (req, res, next) {
  //res.send('POSTS API');
  Post.find(function (err, posts) {
    if (err) {
      res.send(err);
    }
    res.json(posts);
  });
};*/

// Get All User Posts
PostsController.listPosts = function (req, res) {
  const username = req.params.username || user.username || null; // const userId = req.params.id || null;

  // вспомогательная функция, получающая posts, основанные на запросе
  // get posts by query request -- MAIN func
  const respondWithPosts = function (query) {
    Post.find(query, function (err, posts) {
      if (err !== null) {
        res.json(500, err);
      } else {
        res.json(200, posts);
      }
    });
  };

  // query request:
  if (username !== null) { // if registered user
    User.find({ "username": username }, function (err, result) {
      if (err !== null) {
        res.json(500, err); // db err
      } else if (result.length === 0) {
        // user id not found!
        res.send(404);
      } else {
        // send all posts of this user
        respondWithPosts({ "author": result[0].id });
      }
    });
  // if visitor
  } else {
    // send all posts
    respondWithPosts({});
  }
};

// Save Single Post

/*function(req, res, next) {
  db.posts.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, post){
    const post = req.body; // takes it from the form
    if (!post.title || !(post.isDone + '')) {
      res.status(400);
      res.json({"error": "Bad Data"});
    } else {
      db.posts.save(task, function(err, post) {
        if (err) {
          res.send(err);
        }
        res.json(post);
      });
    }
  });
};*/
PostsController.create = function (req, res) {
      console.log('Creating new post...');
      const username = req.params.username || user.username || null;
      const newPost = new Post({
        "title":req.body.title,
        //"tags":req.body.tags,
        "author": user,
        "created": Date.now,
        "aprooved": false,
      });

      User.Find({ "username": username }, function (err, result) {
        if (err) {
          res.send(500);
        } else {
          if (result.length === 0) {
            // пользователь не найден, поэтому создаем post без владельца
            newPost.author = null;
          } else {
            // пользователь найден, поэтому
            // устанавливаем владельца для этого post с пользовательским ID
            newPost.author = result[0]._id;
          }

          newPost.save(function (err, result) {
            console.log(result);
            if (err !== null) {
              // post не был сохранен!
              //console.log(err);
              res.json(500, err);
            } else {
              //console.log('post saved');
              //console.log(result);
              res.json(200, result);
            }
          });
        }
      });
};

// Get Single Post

/* function(req, res, next) {
  Post.findOne({_id: ObjectId(req.params.id)}, function(err, post){
    if (err) {
      res.send(err);
    }
    res.json(post);
  });
};*/
PostsController.show = function (req, res) {
      // это ID, который мы отправляем через URL
      const id = req.params.id;
      console.log('Showing post: ' + id);
      // находим post с соответствующим ID(:переменной)
      Post.find({ "_id": id }, function (err, post) {
        if (err !== null) {
          res.json(500, err); // возвращаем внутреннюю серверную ошибку
        } else {
          if (post.length > 0) {
            res.json(200, post[0]); // возвращаем успех!
          } else {
            res.send(404); // мы не нашли post с этим ID! ("Не найдено")
          }
        }
      });
};
// объеденить эти два
// Show all posts of specific user
UsersController.listByUser = (req, res) => {
  Post.find({'author.username': req.params.username}, null, {'sort': {'created': -1}}, function (err, posts) {
    if (err) {
      console.log('There was an error while loading data from the database: ', err);
      return res.json({'error': 'Couldn\'t load posts for the user'}, 500);
    }
    res.json({'posts': posts});
  });
};

// Update Single Post
PostsController.editPost = function(req, res, next) {
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
    res.json({"error": "Bad Data"});
  } else {
    Post.update({_id: ObjectId(req.params.id)}, updPost, {}, function(err, post){
    // db.posts.update({_id: mongojs.ObjectId(req.params.id)}, updPost, {}, function(err, post){
      if (err) {
        res.send(err);
      }
      res.json(post);
    });
  }
};
/*PostsController.update = function (req, res) {
      const id = req.params.id;
      console.log('Updating post: ' + id);
      Post.find({ '_id': id }, function(err, posts) {
        if (err) {
          res.json(500, err);
        } else {
          if (posts.length > 0) {
            console.log(posts[0].complete);
            posts[0].complete = !posts[0].complete;
            console.log(posts[0].complete);
            posts[0].save();
          } else {
            res.send(404);
          }
        }
      });
};*/

// Delete Single Post
PostsController.destroyPost = function(req, res, next) {
  // {_id: post.id}
  Post.deletePost(post.id, function(err, post){
    if (err) {
      res.send(err);
    }
    res.json(post);
  });
};

// Delte All Posts -- modify!
/*PostsController.destroyAll = function (req, res) {
      console.log('Deleteing completed posts'); // delete all posts
      Post.find({ "isDone": true }, function(err, posts) {
        if (err) {
          res.json(500, err);
        } else {
          posts.forEach(function (post) {
            post.remove();
          });
        }
      });
};*/

module.exports = PostsController;
