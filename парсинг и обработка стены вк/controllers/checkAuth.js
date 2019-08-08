/*var HttpError = require("errorHadler").HttpError;

module.exports = function(req, res, next) {
  if (!req.session.user) {
    return next(new HttpError(401, "Вы не авторизованы!")); // || res.redirect('/login')
  }

  next(); // else: OK go in
};*/
