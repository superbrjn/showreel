const gulp = require("gulp");
const sass = require("gulp-sass"); //Подключаем Sass/Scss пакет
const browserSync = require("browser-sync"); // Подключаем Browser Sync для Live Reload
// optimization
const cssnano = require("gulp-cssnano"); // Подключаем пакет для минификации CSS
const rename = require("gulp-rename"); // Подключаем библиотеку для переименования файлов
const autoprefixer = require("gulp-autoprefixer"); // Подключаем библиотеку для автоматического добавления префиксов
// js
const concat = require("gulp-concat"); // Подключаем gulp-concat (для конкатенации файлов в один common.js)
const uglify = require("gulp-uglifyjs"); // Подключаем gulp-uglifyjs (для сжатия JS)
// img
const imagemin = require("gulp-imagemin"); // Подключаем библиотеку для работы с изображениями
const pngquant = require("imagemin-pngquant"); // Подключаем библиотеку для работы с png
const cache = require("gulp-cache"); // Подключаем библиотеку кеширования
// html
const htmlRender = require("gulp-nunjucks-render"); // парсер-компилятор партиалов
//const htmlRender = require("gulp-rigger");
// продакшен
const del = require("del"); // Подключаем библиотеку для удаления файлов и папок

// компиляция sass
gulp.task("sass", function() {
  // Создаем таск "sass"
  return gulp
    .src("client/assets/sass/**/*.scss") // Берем источник
    .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
    .pipe(
      autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], {
        cascade: true
      })
    ) // Создаем префиксы
    .pipe(gulp.dest("client/assets/css")) // Выгружаем результата в папку app/css
    .pipe(browserSync.reload({ stream: true })); // Обновляем CSS на странице при изменении
});

// live-reload синхронизация (сервер)
gulp.task("browser-sync", function() {
  // Создаем таск browser-sync
  browserSync({
    // Выполняем browser Sync
    server: {
      // Определяем параметры сервера
      baseDir: "client" // Директория для сервера - app
    },
    notify: false // Отключаем уведомления
  });
});

// оптимизация js и сss библиотек
/*gulp.task("scripts", function() {
  return gulp
    .src([
      // Берем все необходимые библиотеки
      "client/libs/jquery/dist/jquery.min.js", // Берем jQuery
      "client/libs/magnific-popup/dist/jquery.magnific-popup.min.js" // Берем Magnific Popup
    ])
    .pipe(concat("libs.min.js")) // Собираем их в кучу в новом файле libs.min.js
    .pipe(uglify()) // Сжимаем JS файл
    .pipe(gulp.dest("client/assets/js")); // Выгружаем в папку app/js
});*/

/*gulp.task("code", function() {
  return gulp.src("client/*.html").pipe(browserSync.reload({ stream: true }));
});*/
// создаем gulp задачу на компиляцию всех nunjucks шаблонов в текущей директории
gulp.task("html", function() {
  return (
    gulp
      // run parser on all .html files in the "src" directory
      .src("client/src/pages/*.html") // templates/mixins.html ?? .src("client/src/*.+(html|nunjucks)")
      // Renders template with nunjucks
      .pipe(htmlRender(/** {
      path: ["client/blocks"] // partials
    } **/))
      // output the rendered HTML files to the "dist" directory
      .pipe(gulp.dest("client/build"))
  );
});

/*gulp.task("css-libs", function() {
  return gulp
    .src("client/assets/sass/libs.sass") // Выбираем файл для минификации
    .pipe(cssnano()) // Сжимаем
    .pipe(rename({ suffix: ".min" })) // Добавляем суффикс .min
    .pipe(gulp.dest("client/assets/css")); // Выгружаем в папку app/css
});*/

gulp.task("clean", async function() {
  return del.sync("dist"); // Удаляем папку dist перед сборкой
});

gulp.task("img", function() {
  return gulp
    .src("client/assets/img/**/*") // Берем все изображения из app
    .pipe(
      cache(
        imagemin({
          // С кешированием
          // .pipe(imagemin({ // Сжимаем изображения без кеширования
          interlaced: true,
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [pngquant()]
        })
      )
    )
    .pipe(gulp.dest("dist/img")); // Выгружаем на продакшен
});

// Процессинг
gulp.task("prebuild", async function() {
  var buildCss = gulp
    .src([
      // Переносим библиотеки в продакшен
      "client/assets/css/main.css",
      "client/assets/css/libs.min.css"
    ])
    .pipe(gulp.dest("dist/css"));

  var buildFonts = gulp
    .src("client/assets/fonts/**/*") // Переносим шрифты в продакшен
    .pipe(gulp.dest("dist/fonts"));

  var buildJs = gulp
    .src("client/assets/js/**/*") // Переносим скрипты в продакшен
    .pipe(gulp.dest("dist/js"));

  var buildHtml = gulp
    .src("client/*.html") // Переносим HTML в продакшен
    .pipe(gulp.dest("dist"));
});

gulp.task("clear", function(callback) {
  return cache.clearAll();
});

// Отслеживание изменений
gulp.task("watch", function() {
  gulp.watch("client/assets/sass/**/*.sass", gulp.parallel("sass")); // Наблюдение за sass файлами
  gulp.watch("client/*.html", gulp.parallel("code")); // Наблюдение за HTML файлами в корне проекта
  gulp.watch(
    //["client/assets/js/main.js", "client/assets/libs/**/*.js"],
    "client/assets/js/main.js",
    gulp.parallel("scripts")
  ); // Наблюдение за главным JS файлом и за библиотеками
});
// dev: команда $ gulp
gulp.task(
  "default",
  gulp.parallel("css-libs", "sass", "scripts", "browser-sync", "watch")
);
// prod: команда $ gulp build
gulp.task(
  "build",
  gulp.parallel("prebuild", "clean", "img", "sass", "scripts")
);
