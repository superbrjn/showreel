// не проверял ещё
document.forms.loginForm.addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    // on event of 'sibmit'
    //let form = $(this);
    //$(".error", form).html("");
    //$(":submit", form).button("loading");

    let url = "/login";
    let xhr = new XMLHttpRequest();
    let formData = new FormData(document.forms.loginForm);
    //data: form.serialize(),

    xhr.open("POST", url, true);
    //xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

    xhr.addEventListener("readystatechange", function(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        return function() {
          //form.html("Вы вошли в сайт").addClass("alert-success");
          document.getElementsByClassName("alert-success").textContent =
            "Вы вошли!";

          window.location.href = "/dash"; // redirect inside
        };
      } else if (xhr.readyState == 4 && xhr.status != 200) {
        return function(xhr) {
          let error = JSON.parse(xhr.responseText);
          //$(".error", form).html(error.message); // render error
          document.getElementsByClassName("alert-danger").textContent =
            error.message;
        };
      }
    });

    /*xhr.addEventListener("loadend", function() {
      //$(":submit", form).button("reset");
      document.getElementsByClassName("submit");
    });*/

    formData.append("file", file);
    xhr.send(JSON.stringify(formData));

    document.forms.loginForm.value = "";
  },
  false
);

// взял jquery из другого проекта:
/*$(document.forms["login-form"]).on("submit", function() {
  // on event of 'sibmit'
  var form = $(this);
  $(".error", form).html("");
  $(":submit", form).button("loading");

  $.ajax({
    // send form data to server
    url: "/login",
    data: form.serialize(),
    method: "POST",
    complete: function() {
      $(":submit", form).button("reset");
    },

    statusCode: {
      200: function() {
        form.html("Вы вошли в сайт").addClass("alert-success");
        window.location.href = "/chat"; // redirect inside
      },

      403: function(jqXHR) {
        var error = JSON.parse(jqXHR.responseText);
        $(".error", form).html(error.message); // render error
      }
    }
  });

  return false;
});*/
