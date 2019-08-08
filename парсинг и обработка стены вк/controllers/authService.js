module.exports = function(req, res, next) {
  // OAuth 2.0: Authorization code flow (server only)
  // NB: проверить все методы API на актуальность версии!
  var vkCreds = {
    //client_id: "5817425", // ID приложения
    //client_secret: "6Op89MdNcikiPANnU2Uq", // Защищённый ключ
    redirect_uri: "http://localhost/auth", // Доверенный redirect URI, там, где лежит этот файл
    service_key:
      "5e31d0255e31d0255e31d025ec5e69147455e315e31d02505c2036745ac54dde35dcc65", // Сервисный ключ доступа к отрытым методам
    // + Client credentials flow // секретный ключ к специальным secure-методам
    response_type: "token", // deprecated: "code"
    token: "", // parseJSON
    v: "5.90", // actual
    //code: "", // req.query.code
    scope: "offline", // permissions: [friends,messages]
    linkAuth: "https://oauth.vk.com/authorize",
    linkAccess: "https://oauth.vk.com/access_token"
  };

  // session
};

// PHP-примеры
// раз: https://ruseller.com/lessons.php?rub=37&id=1659
// два: https://codd-wd.ru/primery-realizacii-avtorizacii-oauth-2-0-vkontakte-na-php-i-javascript-vk-api/
// три: http://savepearlharbor.com/?p=188102

/*
// auth
exports.index = function(req, res, next) {
  res.render("index");
};

exports.registerPost = function() {
  var user = new User({
    //name: req.body.name,
    //pass: req.body.pass,
    token: token,
    owner_id: owner_id
  });
  user.save(function(err) {
    if (err) {
      error = "name alreday exists";
      res.render("register", { error: error });
    } else {
      res.redirect("/dashboard");
    }
  });
};

exports.loginPost = function(req, res, next) {
  User.findOne({ name: req.body.name }, function(err, user) {
    if (!user) {
      res.render("login", { error: " wrong pass or name" });
    } else {
      if (res.body.pass === user.pass) {
        // compare res.body.pass === user.pass OR res.session.user = user;
        // set-coockie:session = {name:name, pass: pass }
        res.redirect("dashboard");
      } else {
        res.render("login", { error: "wrong name or pass" });
      }
    }
  });
};

//authorize
exports.dashboard = function(req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({ name: req.session.name }, function(err, user) {
      if (!user) {
        req.session.reset(); //destroy
        res.redirect("/login");
      } else {
        res.locals.user = user;
        res.render("/dashboard");
        req.session.user = user;
      }
    });
  } else {
    res.redirect("/login");
  }
};

exports.logout = function(req, res, next) {
  req.session.reset(); // req.session = null;
  res.redirect("/");
};*/
