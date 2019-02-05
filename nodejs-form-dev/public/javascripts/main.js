/**
 * С самого начала у нас была тактика...
 * 1. Создаём переменные с ссылками на html-элементы, и декомпозированный объект для будущей пересылки
 * 2. Вешаем слушателей событий на кнопки, и, нпмр, на изменения поля добавления файлов
 * 3. Создаём конструктор отображения превью (пустые элементы, наполнения, кнопки отмены)
 * 4. Создаём функции парсинга полей формы, чтения комментария и файлов
 * 5. Инициируем объекты AJAX-запроса и пишем тело запроса (собираем FormData)
 * 6. Вызываем фасады рендеринга и отправки в событиях
 **/

// --------------------------------------- Переменные ------------------------------------------
let formEl = document.forms.feedbackForm; // Текущая форма (или сразу document.feedbackForm)
let inputs = formEl.querySelectorAll("input, select, textarea");
let picsInput = document.querySelector('input[type="file"]'); // поле выбора файлов для загрузки
//let picsInput = formEl.elements.images; // или так
let previewBtn = document.querySelector(".preview"); // Кнопка предпросмотра

let displayOutput = document.querySelector(".preview-msg"); // область предварительного просмотра
let previewTXT = document.createElement("div"); // текстовая часть (для верстки)
let previewIMG = document.createElement("div"); // часть с картинками (можно через canvas манипулировать)

let successMsg = document.querySelector(".alert-success"); // извещение об успешном выполнении
let failMsg = document.querySelector(".alert-danger");
let cancelBtn; //кнопка отмены выбора картинки

let formPkg = {}; // собираемый объект для пересылки
let fileList = []; // picsInput.files; Переводим Nodelist в массив

// ------------------------------------------ Слушатели -----------------------------------------

// Отслеживание изменений
picsInput.addEventListener("change", function(e) {
  fileList = []; // caching for later, in case of a multiple file selection

  for (var i = 0; i < picsInput.files.length; i++) {
    fileList.push(picsInput.files[i]); //Get the selected files from the input
    readFile(picsInput.files[i]); // создание li-списка +прогрессбар, cancelbtn
  }
});

// Отправка готовой формы на сервер
formEl.addEventListener("submit", function(e) {
  e.preventDefault();

  submitForm(formEl);
});

// Отрисовка предпросмотра по нажатию кнопки "Превью"
previewBtn.addEventListener("click", function(e) {
  renderPreview(e);
});

// Отменить выбор файла
//cancelBtn.addEventListener("click", function(e) {
//  cancelPic(e);
//});

// -------------------------------------- Парсинг формы ----------------------------------------
// вернуть обратно вынесенные циклы
function parseForm() {
  // text
  // file
}
// ---------------------------------- Обработчик файлов - чтение -------------------------------
function readFile(file) {
  let reader = new FileReader();

  reader.onerror = errorHandler;
  reader.onabort = function(e) {
    alert("File read cancelled");
  };

  //добавляем все новые файлы в li-список для загрузки
  //вынести в makeUploadList(file);
  let uploadList = document.querySelector(".filenameList");
  let uploadinfo = document.createElement("li");
  let picname = "<span>" + file.name + "</span>";
  let btnremove = '<div class="js-file-remove file-remove"></div>';
  let pbar = '<div class="progress-bar js-progress-bar"></div>';
  uploadinfo.innerHTML = picname + btnremove + pbar;
  uploadList.appendChild(uploadinfo);

  //событие успешного окончания загрузки
  reader.onload = function(e) {
    //что-нибудь делаем
    // вызываем previewFile
  };

  // вывод процентной полосы загрузки
  //reader.onprogress = makeProgressbar(e);

  // читаем
  // - если браузер не поддерживает readAsBinaryString {...}
  reader.readAsBinaryString(file);
}

// -------------------------- Конструктор отображения предпросмотра -----------------------------
function renderPreview(e) {
  displayOutput.appendChild(previewTXT);
  displayOutput.appendChild(previewIMG);
  //parseForm();
  // text
  for (i = 0; i < inputs.length; i++) {
    // парсим, и работаем только с не пустыми
    if (0 < inputs[i].value.length) {
      // получаем доступ к атрибутам поля
      let ff = formEl.querySelectorAll(
        "input[name=" +
          inputs[i].name +
          "],select[name=" +
          inputs[i].name +
          "],textarea[name=" +
          inputs[i].name +
          "]"
      );

      renderTextFields();
      //buildPkg(inputs, ff);
    }
  }
  renderFilePicks();
}

function renderTextFields() {
  let txt = document.createElement("li");
  if (inputs[i].hasAttribute("data-name")) {
    let fname =
      "<strong>" + inputs[i].getAttribute("data-name") + ": </strong>";
    let fval = "<i>" + inputs[i].value + "</i>";
    txt.innerHTML = fname + fval;
    previewTXT.appendChild(txt);
  }
}

function renderFilePicks(e) {
  fileList.forEach(function(file) {
    if (!file.type.match(/image.*/)) {
      // this file is not an image.
      alert("Загружать можно только картинки!");
    } else {
      let reader = new FileReader();
      /*reader.onerror = errorHandler;
      reader.onabort = function(e) {
        alert("File read cancelled");
      };*/
      reader.readAsDataURL(file);

      reader.onload = function() {
        // TODO: вынести
        let img = document.createElement("img");
        img.className = "thumb";
        let t = document.createAttribute("title");
        t.value = file.name;
        img.setAttributeNode(t);

        img.src = reader.result;

        img.onload = function() {
          // TODO: вынести
          let canvas = document.createElement("canvas");
          let context = canvas.getContext("2d");

          let MAX_WIDTH = 320;
          let MAX_HEIGHT = 240;

          if (img.width > img.height) {
            if (img.width > MAX_WIDTH) {
              img.height *= MAX_WIDTH / img.width;
              img.width = MAX_WIDTH;
            }
          } else {
            if (img.height > MAX_HEIGHT) {
              img.width *= MAX_HEIGHT / img.height;
              img.height = MAX_HEIGHT;
            }
          }
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          let dataurl = canvas.toDataURL(file.type); //toBlob
          img.src = dataurl;
        };
        previewIMG.appendChild(img);
      };
    }
  });
}

// ------------------------------------------- СБОРКА -------------------------------------------
function submitForm(form) {
  //parseForm();
  for (i = 0; i < inputs.length; i++) {
    // парсим, и работаем только с не пустыми
    if (0 < inputs[i].value.length) {
      // получаем доступ к атрибутам поля
      let ff = formEl.querySelectorAll(
        "input[name=" +
          inputs[i].name +
          "],select[name=" +
          inputs[i].name +
          "],textarea[name=" +
          inputs[i].name +
          "]"
      );

      //renderTextFields();
      buildPkg(inputs, ff);
    }
  }
  // сериализуем данные в json
  formPkg = JSON.stringify(formPkg);
  // собираем данные в пакет
  let formData = new FormData();
  formData.append("fieldsData", formPkg);

  // берём файлы из массива на загрузку
  fileList.forEach(function(file) {
    //проходимся по li-списку с картинками на загрузку
    let filenameList = document.querySelectorAll(".filenameList li"); // document.fnamelist.childNodes;

    for (let i = 0; i < filenameList.length; i++) {
      var onefname = filenameList[i].querySelector("span").textContent;
      // если имя файла там, совпадает с таковым в массиве
      if (file.name === onefname) {
        // добавляем только их
        formData.append(file.name, file);
      }
    }
  });

  //console.log("Форма: ", formPkg, "Посылка: ");
  // Uncomment to display the key/value pairs
  for (var pair of formData.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }
  // and comment to prevent sending
  //sendForm(formData, form);
}

function buildPkg(inputs, ff) {
  //проверяем не является ли поле системным
  if (
    inputs[i].getAttribute("type") != "hidden" &&
    inputs[i].hasAttribute("data-name")
  ) {
    formPkg[inputs[i].name] = inputs[i].value;
  } // если системное - прикрепить отдельно (точнее переписать и добавлять поля свойствами одного объекта)
}

// ------------------------------------------ ОТПРАВКА ------------------------------------------
function sendForm(data, form) {
  let actionURL = "/upload";
  let xhr = new XMLHttpRequest();

  xhr.open("POST", actionURL, true);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

  xhr.addEventListener("readystatechange", function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // Готово. Информируем пользователя и очищаем форму
      form.reset();
      //console.log(xhr.responseText);
      showStatusMsg(successMsg);
    } else if (xhr.readyState == 4 && xhr.status != 200) {
      // Ошибка. Информируем пользователя
      console.log(xhr.status + ": " + xhr.statusText);
      showStatusMsg(failMsg);
    }
  });

  // смотрим ответ сервера
  xhr.addEventListener("load", function() {
    console.log("-------- Ответ сервера на клиенте: -------- \n", xhr.response);
  });

  xhr.send(data);
}

// ------------------------------- Второстепенные хэлперы и хуки --------------------------------

// показать сообщение об ошибке-успехе загрузки (снимаем класс hidden)
function showStatusMsg(el) {
  let className = "hidden";

  if (el.classList) el.classList.remove(className);
  else
    el.className = el.className.replace(
      new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"),
      " "
    );
}

// Обработка ошибок чтения файлов
let reader;

function abortRead() {
  reader.abort();
}

function errorHandler(evt) {
  switch (evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
      alert("File Not Found!");
      break;
    case evt.target.error.NOT_READABLE_ERR:
      alert("File is not readable");
      break;
    case evt.target.error.ABORT_ERR:
      break; // noop
    default:
      alert("An error occurred reading this file.");
  }
}

// + form validation on clientside - html5
// + file upload (multipart/form-data)
// + Допустимые форматы: JPG, GIF, PNG. (images/*)
// + images preview - reader onloadend (CSS width/height)
// TODO:
// sortByName - ajax get request (url /commentsByName)
// sortByEmail - ajax get request (url /commentsByEmail)
// sortByLast - ajax get request (url /commentsByLast)
/**
 * -cancel btn - remove img
 * -progressbar
 * -сверстать нормально превью и загрузку данных:
 *  добавить классы, написать табы (да и кнопки сделать заметнее, границу пикселем, например) и сетку вообще.
 */
/**
 * ## Пока рефакторил, запутался, поэтому, вот, дорожная карта:
 *
 * 1. Событие изменение - добавление файла
 *    перебор всех вложений в инпуте,
 *    добавление в массив,
 *    создание элементов li-списка (+прогрессбар, кнопки отмены) для кжд файла в массиве
 *
 * 2. Событие превью
 *    перебор массива,
 *    сравниваем имя файла в массиве с именем в li-списке,
 *    создание файлридера, чтение файла, создание элементов с миниатюрой
 * перебор элементов ввода, перебор их атрибутов, (добавляем данные полей в объект), создание элементов с текстом++
 *
 * 3. Событие сабмит
 *    перебор массива,
 *    сравниваем имя файла в массиве с именем в li-списке,
 *    вызов СБОРКИ - добавляем совпавшие файлы (со списком) из массива в FormData,
 * перебор элементов ввода, перебор их атрибутов, добавляем данные полей в FormData
 *    вызов ОТПРАВКИ - создаём файлридер, и onload  - создаём аякс (отправляем FormData)
 *
 * 4. Событие по клику на элемент отмены выбора,
 *    вызов функции удаления узла li-списка
 */
// отрефакторить ещё раз: убрать повторы, и вынести функции для чистоты
