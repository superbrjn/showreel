// Add this file as a link to index.html
jQuery(function($) {
  // wall.get доступен только в standalone-приложении
  // и не доступен для веб-сайтов или через серверную авторизацию
  // https://vk.com/dev/api_requests

  // Импорт параметров авторизации
  var vkConfig = require("./vkAuth").vkConfig;
  var vkUser = require("./vkAuth").vkUser;

  // фабрика, возвращает объект с параметрами для построения ссылки
  function Params(vkConfig, vkUser) {
    this["access_token"] = vkUser.token;
    this["owner_id"] = vkUser.user_id;
    this["count"] = 10;
    this["v"] = vkConfig.v;
  }

  // обработчик отображения записей со стены
  $("#load").on("click", getWall); // btn id="load"

  // создание обращения запроса к API
  function getUrl(methodName, linkParams) {
    if (!methodName) {
      throw new Error("Укажите нужный метод обращения к API!");
    }
    /* 
    PARAMETERS:
    owner_id=200958 -- UserID
    count=100 -- количество выводимых записей (макс за раз)
    offset=5000 -- смещение выборки (макс запросов в день)
    */
    linkParams = linkParams || {};
    //params["access_token"] = token; // "PUT_TOKEN_HERE";
    //params["v"] = v;

    /*
    Req Syntax: https://api.vk.com/method/METHOD_NAME?PARAMETERS&access_token=ACCESS_TOKEN&v=V
    Example: https://api.vk.com/method/users.get?user_ids=210700286&fields=bdate&access_token=533bacf01&v=5.90
    */
    return (
      "https://api.vk.com/method/" +
      methodName + // wall.get
      "?" +
      $.params(linkParams)
    );
  }

  // отправка запроса
  function sendRequest(methodName, linkParams, func) {
    $.ajax({
      type: "GET", // "POST" if data size more then 2Kb
      url: getUrl(methodName, linkParams), //getUrl(method, {linkParams})
      //data: no-data
      dataType: "JSONP",
      success: func
      //error: reqFail
    }).fail(function(jqXHR, textStatus, error) {
      func(error);
    });
  }

  // обратный вызов для обработчика события
  function getWall(linkParams) {
    //sendRequest("wall.get", { owner_id: 200958, count: 100 }, function(data) {
    var params = new Params(vkConfig, vkUser);
    sendRequest("wall.get", params, function(data) {
      renderWall(data.response.items);
    });
  }

  // отображение записей
  function renderWall(posts) {
    var html = "";

    for (var i = 1; i < posts.length; i++) {
      var p = posts[i];
      /*
      Documentation: https://vk.com/dev/wall.get
      JSON: response.items.text
      JSON: response.items.comments.count
      JSON: response.items.likes.count
      JSON: response.items.reposts.count
      JSON: response.items.attachments.photo.sizes.[4.url]
      JSON: response.items.attachments.video.photo_320
      JSON: response.items.id - post id
      */
      html +=
        "<li>" +
        "<p>" +
        p.text +
        "</p>" +
        "<p> L: " +
        p.likes.count +
        "</p>" +
        "<p> R: " +
        p.reposts.count +
        "</p>" +
        "<p> C: " +
        p.comments.count +
        "</p>" +
        "</li>"; // img src=" p.photo_100
    }

    $("ul").html(html);
  }
});
