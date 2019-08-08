module.exports = function(req, res, next) {
  /*// new data
  var formData = {
    formLikesNum: req.body.likes,
    formRepostsNum: req.body.reposts,
    formCommentsNum: req.body.comments
  };
  console.log(formData);
  // Upload all posts from vkDB
  var wallPosts; // = $("post"); // GET all posts
  // wallPosts API connection
  var postLikesNum;
  var postRepostsNum;
  var postCommentsNum;
  console.log(wallPosts);
  // and respond

  // Comparison conditions
  //var vkPostNum = postLikesNum || (postRepostsNum  || postCommentsNum); //&&?
  //var userChoiceNum = formLikesNum || (formRepostsNum || formCommentsNum);
  //var unpopularPost = vkPostNum < userChoiceNum;
  var unpopPostL = postLikesNum < formData.formLikesNum;
  var unpopPostR = postRepostsNum < formData.formRepostsNum;
  var unpopPostC = postCommentsNum < formData.formCommentsNum;

  //loop and filter
  wallPosts.forEach(function() {
    // check condition
    if (unpopPostL || unpopPostR || unpopPostC) {
      var thisLbiggerThenCurRandC =
        formLikesNum > (postRepostsNum && postCommentsNum);
      var thisRbiggerThenCurLandC =
        formRepostsNum > (postLikesNum && postCommentsNum);
      var thisCbiggerThenCurRandL =
        formCommentsNum > (postLikesNum && postRepostsNum);
      if (
        thisLbiggerThenCurRandC ||
        thisRbiggerThenCurLandC ||
        thisCbiggerThenCurRandL
      ) {
        //delete selected post
        console.log("THERE!");
        // $(this).remove(); // API call to delete post https://vk.com/dev/wall.delete
        res.render("index"); // send.JSON
      }
    }
  });*/
  function testFunc(err, result) {
    console.log(result);
    if (err !== null) {
      console.log(err);
      res.send(err);
    } else {
      res.json(result);
    }
  }

  // TODO:
  // server success msg
  // server error msg
  // server db handling process bar
};
