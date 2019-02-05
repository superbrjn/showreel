//var bcrypt = require("bcrypt");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  id: ObjectId,
  username: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  admin: Boolean
});

// надо меньше заморочек
// generating a hash
/*UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(14), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};*/

module.exports = mongoose.model("User", UserSchema);
