const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

// Passport strategy - local storage
// Configuration:
module.exports = function (passport) {
  console.log("Passport initialized...");
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = config.secret;
  // on submit, this runs:
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => { // options, verify
    console.log("Passport useing JWT...");
    console.log("payload is: ", jwt_payload);
    //console.log(jwt_payload.data);
    //console.log(jwt_payload._data); --> undefined
    //console.log(jwt_payload._doc); --> undefined
    User.getUserById(jwt_payload.data._id, (err, user) => { // search db for user id with same id as in jwt_payload, send user obj in cb on success
      console.log("Passport retrieving user...");
      // Error: Failed to serialize user into session
      if (err) {
        console.log(err.stack);
        //return done(err, user);
        return done(err, false);
      }

      if (user) {
        //console.log('Passport serializing user...');
        /*passport.serializeUser((user, done) => { // from session store
          // return done(null, user); never ends
          // done(null, user.id); never ends
          return done(null, user.id);
        });*/
        return done(null, user); // valid credentials (name, passw) return user
      } else {
        //console.log('Passport deserializing user...');
        /*passport.deserializeUser((user, done) => { // to session store
          // return done(null, false);
          // done(null, user);
          return done(null, false);
        });*/
        return done(null, false); // not valid, auth failed
      }
    });
  }));
};
