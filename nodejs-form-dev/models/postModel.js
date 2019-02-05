var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  //author: { type: Schema.ObjectId, ref: "User" },
  username: String,
  email: String,
  aprooved: { type: Boolean, default: false },
  content: {
    text: String,
    image: Object
  },
  created_at: Date,
  updated_at: Date
});

// on every save, add the date
PostSchema.pre("save", function(next) {
  // get the current date
  var currentDate = new Date();
  // change the updated_at field to current date
  this.updated_at = currentDate;
  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;
  next();
});

module.exports = mongoose.model("Post", PostSchema);
