const mongoose = require("mongoose");
const moment = require('moment');

/*const sortEnum = [
    function (sortBy) {
        // 'this' is the document being validated
        return this.created && this.created.indexOf(sortBy) !== -1;
    },
    'sortBy must be contained in created',
    function (arg, cb) {
                        Post.find({}, (err, posts) => {
                                    if (err) {
                                        cb(err);
                                    } else {
                                        cb(posts.sortByEnum.indexOf(arg) >= 0);
                                    }
                                });
                            },
];*/
/*Post.pre('save', function (next) {
  let me = this;
  SortModel.find({},(err, post)=>{
    (post.created.indexOf(me.created) >= 0) ? next() : next(new Error('validation failed'));
  });
});*/

//const ObjectID = mongoose.Schema.Types.ObjectId; // внешний ключ для связи с др схемами
const PostSchema = mongoose.Schema({
    title: String, // text content, post.title
    //tags: [String],
    author: { type: Schema.ObjectId, ref: "User" },
    created: { type: Date, default: Date.now },
    aprooved: { type: Boolean, default: false },
    //sortBy: { type: String, required: true, enum: ['created', 'username', 'email'], default: 'created' },
    //sortBy: { type: Schema.ObjectId, required: true, enum: [created, author.username, author.email], default: created },
    //sortBy: { type: String, required: true, validate: { isAsync: true, validator: sortEnum } },
}/*, {collection: 'post'}*/); // give name to this colletion in database - 'post' instead of 'posts'

PostSchema.virtual('created')
          .get(function () {
            return this.created ? moment(this.created).format('MMMM DD, YYYY') : '';
});

//const Post = mongoose.model("Post", PostSchema);
//module.exports = Post;
module.exports.Post = mongoose.model("Post", PostSchema); // better: module.exports.PostModel or not

/**
* Basic Utility Functions:
*/

module.exports.getPostById = function (id, callback) {
  console.log("UserModel retrieving user by id from DB...");
  Post.findById(id, callback);
};

// find post in database
module.exports.getUserByUsername = function (username, callback) {
  console.log("UserModel quering user from DB...");
  const query = { username: username };
  Post.findOne(query, callback);
};

// save post to database
module.exports.addPost = function (newPost, callback) {

      newPost.save(callback); // сохр в бд
      console.log("New post should be saved in database!");
};


// Edit/Update post
module.exports.updatePostById = function (id, callback) {
  //const query = { id: _id };
  Post.findOneAndUpdate(id, req.body, callback);
};

// Delte single post
module.exports.deletePost = function (id, callback) {
  Post.findOneAndRemove(id, callback);
};
