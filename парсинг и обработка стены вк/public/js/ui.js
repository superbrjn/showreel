// --- UI (main) ---
jQuery(document).ready(function($) {
  // Анимация обложки
  $(window).on("load", function() {
    $(".cover").addClass("cover-scaling");
  });
  $(window).on("load", function() {
    setTimeout(function() {
      $(".cover .cover-scaling").removeClass("cover-scaling");
    }, 100);
  });

  // Поведение кнопки
  function btnSending() {
    $("#btnDel").button("loading");
  }
  function btnDefault() {
    $("#btnDel").button("reset");
  }

  // Сохранение состояния (до закрытия вкладки) -- UI
  var elements = document.querySelectorAll("input, textarea");

  for (i = 0; i < elements.length; i++) {
    (function(element) {
      var id = element.getAttribute("id");
      element.value = sessionStorage.getItem(id);
      element.oninput = function() {
        sessionStorage.setItem(id, element.value);
      };
    })(elements[i]);
  }
  /*/ Хранит состояние (бессрочно) -- Users
  if (window.localStorage) {
  var elements = document.querySelectorAll('[name]');
  for (var i = 0, length = elements.length; i < length; i++) {
    (function(element) {
      var name = element.getAttribute('name');
      element.value = localStorage.getItem(name) || '';
      element.onkeyup = function() { // всё что печатается на лету
        localStorage.setItem(name, element.value);
      };
    })(elements[i]);
  }
  }*/

  // Обработка Успешной отправки - clientside
  function submissionDone(data) {
    $("#success_message").show();
    $("#error_message").hide();
  }
  // Ошибка - clientside
  function submissionFail(jqXHR, textStatus, errorThrown) {
    //error(xhr, ajaxOptions, thrownError)
    //var key = xhr.statusText;
    //var val = xhr.responseText;
    $("#error_message").append("<ul></ul>");

    jQuery.each(jqXHR, function(textStatus, errorThrown) {
      //(thrownError, function(key, val)
      $("#error_message ul").append(
        "<li>" + errorThrown + ":" + textStatus + "</li>"
      );
    });
    $("#success_message").hide();
    $("#error_message").show();
  }

  // Отправка данных из Формы
  $("#form").submit(function(e) {
    e.preventDefault(); // don't go anywhere
    $form = $(this); // selected all #Form data

    // send form-data to server
    $.ajax({
      type: "POST", // $(this).attr('method'),
      url: "/", // server route url: "handler.php",
      data: $form.serialize(), // form-data from page
      dataType: "json", // if nothing - auto
      beforeSend: btnSending,
      complete: btnDefault,
      success: submissionDone, // callback when done
      error: submissionFail
    });
  });

  // TODO:
  // Стена (preview)
});
