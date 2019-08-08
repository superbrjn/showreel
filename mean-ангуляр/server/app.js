const express = require('express');
const http = require('http');
const path = require('path'); // part of core
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const debug = require('debug')('mean-auth:server');

const config = require('./config/database');

//const index = require('./routes/index');
const users = require('./routes/users'); // API file for interaction with MongoDB
const posts = require('./routes/posts');
const visitors = require('./routes/visitors');
const admin = require('./routes/admin');

/**
* DATABASE:
*/
//mongoose.connect(config.database, { useMongoClient: true, promiseLibrary: global.Promise });
//mongoose.createConnection(config.database, { useMongoClient: true });
mongoose.set('debug', true);  // Просим Mongoose писать все запросы к базе в консоль для отладки кода
mongoose.connection.openUri(config.databaseUri, { promiseLibrary: global.Promise });
mongoose.connection.on('error', (err) => {
  console.log('Mongoose default connection error: ' + err);
});
mongoose.connection.on('connected', () => {
  console.log('Connected to database: ' + config.databaseUri);
});

const app = express();

/**
* Configuration:
*/
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(cors()); // before any routes
//app.use(logger('combined')); // 'dev'
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client/public'))); // angular DIST output folder

// Passport auth inject:
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//app.use('/', index);
app.use('/users', users); // API location
app.use('/api', posts);
app.use('/visitors', visitors);
app.use('/admin', admin);

// makes sure all other routes go to angular client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

/*
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.send(err); // res.json('error');
});
*/

const port = process.env.PORT || 3000; // heroku: 8080
app.set('port', port);
const server = http.createServer(app);
app.listen(port, () => {
  console.log("Server started on port: " + port);
});

//module.exports = app;
