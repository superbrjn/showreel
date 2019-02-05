var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const formidable = require("express-formidable"); // multipart bodies parser
// const im = require("imagemagick"); // in controller!
const mongoose = require("mongoose");
const session = require("client-sessions"); // keep admin/user state

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

//mongoose.Promise = global.Promise;
mongoose.connect(
  //"mongodb://brjn:1Btuchituchituchi@ds129462.mlab.com:29462/nodejs-form",
  "mongodb://admin:admin123@ds129462.mlab.com:29462/nodejs-form",
  { useNewUrlParser: true }
);
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
//app.use(express.urlencoded({ extended: true })); // multipart
app.use(formidable());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    cookieName: "session",
    secret: "random_string_goes_here",
    duration: 30 * 60 * 1000, // milseconds of expiring
    activeDuration: 5 * 60 * 1000, // prolongation on every req
    httpOnly: true, // don't let browser javascript access cookies ever
    secure: true, // only use cookies over https
    ephemeral: true // delete this cookie when the browser is closed
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
