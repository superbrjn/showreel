// Add this file as a link to index.html
var qs = require("querystring");
jQuery(function($) {
  // OAuth 2.0: Implicit flow (client only, web or standalone)
  var vkConfig = {
    client_id: "6764224", // ID приложения, required
    //client_secret: "6Op89MdNcikiPANnU2Uq", // Защищённый ключ
    //redirect_uri: "http://localhost/vkauth", // Доверенный redirect URI, там, где лежит этот файл, required
    redirect_uri: "https://oauth.vk.com/blank.html ", // standalone required
    scope: "wall,notes,offline", // permissions: [wall,notes,offline]
    response_type: "token", // deprecated type: "code", GET: req.query.token
    v: "5.90" // API version, required
    //linkAuth: "https://oauth.vk.com/authorize",
    //linkAccess: "https://oauth.vk.com/access_token"
  };

  var vkUser = {
    token: function() {
      var tok = localStorage.getItem("access_token");
      return tok;
    },
    user_id: function() {
      var uid = localStorage.getItem("user_id");
      return uid;
    }
  };
  function getUser(data) {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user_id", data.user_id);
  }

  $(".vk-login-button").on("click", reqAuth); // requestAuth // mb add (<a href="this.link">)
  $(".vk-logout-button").on("click", logout); // destroy session and clear localStorage

  // обратный вызов чтения данных из URL
  // in - http response data, out - json object
  function readURL(objWithData, next) {
    var data = "";

    objWithData.on("data", function(chunk) {
      return (data += chunk);
    });
    return objWithData.on("end", function() {
      var parsed;
      if (data) {
        parsed = JSON.parse(data);
        getUser(parsed);
      }
      return next(parsed);
    });
    /*
    // OR
    
    data.token = req.query.access_token;
    data.user_id = req.query.user_id;
    data.error = req.query.error;
    data.error_description = req.query.error_description;
    return next(data);
    */
  }
  /*function readData(objWithData, next) {
      var data = "";
      objWithData.on("data", function(chunk) {
        return (data += chunk);
      });
      return objWithData.on("end", function() {
        var parsed;
        if (data) {
          parsed = JSON.parse(data);
        }
        return next(parsed);
      });
    };*/

  // составим ссылку обращения к API авторизации
  // in - object with params, out - string
  function getAuthUrl(vkConfig) {
    //var options = vkConfig; // init
    //var host = options.linkAuth;
    var host = "https://oauth.vk.com";
    var path = "/authorize";

    var options = vkConfig;
    //params["client_id"] = options.client_id;
    //params["redirect_uri"] = options.redirect_uri;
    //params["scope"] = options.scope;
    //params["response_type"] = options.response_type;
    //params["v"] = options.v;
    var params = qs.stringify(options);

    if (!host || !params) {
      throw new Error(
        "Упс, неверно составлена ссылка обращения к API авторизации!"
      );
    }
    // Пример: https://oauth.vk.com/authorize?client_id=1&display=page&redirect_uri=http://example.com/callback&scope=friends&response_type=token&v=5.90&state=123456
    return host + path + "?" + params;
  }
  /*var buildAuthUrl = function(appOptions, userCode) {
    var host = "oauth.vk.com";
    var path = "/access_token/";
    var options = appOptions;
    options.code = userCode;
    var parameters = qs.stringify(options);
    return {
      host: host,
      path: path + "?" + parameters
    };
  };*/

  // запрос по ссылке
  // in - object with params, out - json object
  function reqAuth(vkConfig, vkUser, next) {
    var authUrl = getAuthUrl(vkConfig);
    $.get(authUrl, function(data) {
      // response
      readURL(data, next);
    });
  }
  /*function authorize(appOptions, userCode, next) {
    var authUrl = buildAuthUrl(appOptions, userCode);
    return https.get(authUrl, function(res) {
      return readData(res, next);
    });
  }*/

  // Пример ссылки с правами доступа
  // http://REDIRECT_URI#access_token=
  // 533bacf01e11f55b536a565b57531ad114461ae8736d6506a3&expires_in=86400&user_id=8492&state=123456
  // Пример ошибки
  // http://REDIRECT_URI#error=access_denied&
  // error_description=The+user+or+authorization+server+denied+the+request.

  // вызов
  reqAuth(vkConfig, vkUser, function(data) {
    if (data.error) {
      return console.log(data.error + ": " + data.error_description);
    } else {
      return console.log(
        "user_id: " + data.user_id + ", access_token: " + data.access_token // response.access_token
      );
    }
  });

  function logout(vkUser) {
    vkUser.token = null;
    vkUser.user_id = null;
  }
});
// 1. Открытие диалога авторизации
// перенаправить браузер пользователя по адресу https://oauth.vk.com/authorize, передав параметры
// 2. Разрешение прав доступа
// на странице куда перенаправили пользователя, он подтверждает права из параметра scope
// 3. Получение access_token
// браузер пользователя перенаправлен по адресу redirect_uri, указанному при (п.1) открытии диалога авторизации,
// при этом токен будет лежать в URL

/*
// --------- Имплементация на CoffeeScript -----------
https = require 'https'
qs = require 'querystring'

# чтение данных
readData = (objWithData, next) ->
  data = ''
  objWithData.on 'data', (chunk) ->
    data += chunk
  objWithData.on 'end', -> 
    parsed = JSON.parse data if data
    next parsed    

# составление ссылки
buildAuthUrl = (appOptions, userCode) ->
  host = 'oauth.vk.com'
  path = '/access_token/'
  options = appOptions
  options.code = userCode
  parameters = qs.stringify options
  host: host, path: "#{path}?#{parameters}"

# запрос авторизации по ссылке
authorize = (appOptions, userCode, next) ->
  authUrl = buildAuthUrl appOptions, userCode
  https.get authUrl, (res) ->
    readData res, next


#client use example
appOptions = client_id: 'your_app_id', client_secret: 'your_app_secret'
userCode = 'code'

authorize appOptions, userCode, (data) ->
  if data.error
    console.log "#{data.error}: #{data.error_description}"
  else  
    console.log "user_id: #{data.user_id}, access_token: #{data.access_token}"
*/

// Ещё пример потуг: https://habr.com/post/310594/
