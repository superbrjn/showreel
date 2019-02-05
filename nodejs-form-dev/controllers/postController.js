const formidable = require("formidable");
const im = require("imagemagick");
const Post = require("../models/postModel");

exports.index = function(req, res, next) {
  res.render("index");
};

exports.upload = function(req, res, next) {
  // handling and saving files
  var form = new formidable.IncomingForm();
  form.parse(req);

  form.on("error", function(err) {
    console.error("Error", err);
    throw err;
  });

  form.on("fileBegin", function(name, file) {
    file.path = __dirname + "/tmp/" + file.name;
  });

  form.on("file", function(name, file) {
    console.log("Uploaded IMG: " + file.name);
  });

  form.on("file", function(err, file) {
    /*
    // сделать уменьшение при превышении заданного размера
    if (file.size > 1e6) {
      res.render(error, function(err, msg) {
        res.status(413).send({ message: "Error, File too BIG!" });
        //res.status(413).end("File too big");
      });
      //req.connection.destroy();
    }
    */

    let inputPath = __dirname + "/tmp/" + file.name;
    let outputPath = __dirname + "/tmp/small/" + file.name;
    let width = 320;
    let height = 240;
    let args = [
      inputPath,
      "-filter",
      "Triangle",
      "-define",
      "filter:support=2",
      "-thumbnail",
      width,
      height,
      "-unsharp 0.25x0.25+8+0.065",
      "-dither None",
      "-posterize 136",
      "-quality 82",
      "-define jpeg:fancy-upsampling=off",
      "-define png:compression-filter=5",
      "-define png:compression-level=9",
      "-define png:compression-strategy=1",
      "-define png:exclude-chunk=all",
      "-interlace Plane", //"-interlace none",
      "-colorspace sRGB",
      "-strip",
      outputPath
    ];
    im.convert(args, function(err, stdout, stderr) {
      if (err) throw err;
      console.log("img resized");
    });
  });

  form.on("file", function(err, file) {
    // file filter
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.name).toLowerCase());
    const mimetype = filetypes.test(file.type);

    if (mimetype && extname) {
      return file;
    } else {
      console.error(err);
      res.render(error, { message: "You can upload images only!" });
    }

    // or with imagemagick
    /*im.identify(path, function(err, features) {
      if (!err) {
        if (
          features &&
          features.properties &&
          ["png", "jpeg", "jpg", "gif"].indexOf(
            features.format.toLocaleLowerCase()
          ) > -1
        ) {
          // это картинка нужного нам формата
        } else {
          // это какой-то файл нас не интересующий
        }
      } else {
        console.log("skjsgfgks", err);
      }
    });*/
  });

  /*
  form.on('aborted', () => {
    console.error('Request aborted by the user')
  })

  form.on('end', () => {
    // redirect or smth
    res.end()
  })
  */

  // saving text
  form.on("field", function(name, field) {
    console.log("Field", name, field);
  });
  //req.fields contains non-file fields
  //req.files contains files

  console.log(
    "--- Прилетело на сервер --- \n",
    "\n Поля: \n",
    req.fields,
    "\n Файлы: \n",
    req.files
  );
  // поля не сохраняются
  // картинка сохр не туда
  // разобраться как сохр множество урл-картинок в объект поста
  // вывод: парсер не подключается к работе
  const newPost = new Post({
    username: req.fields.fieldsData.name,
    email: req.fields.fieldsData.email,
    //created_at: Date.now, // done in userModel - presave fn
    aprooved: false,
    content: {
      text: req.fields.fieldsData.message,
      image: req.files.image.path
      //image: req.files.imgLinks // imgLinks[];
    }
    /*let imgLinks = function() {
    // TODO
    for (let k; k < 0; k++) {
      k[0] = __dirname + "/tmp/small/" + file.name;
    }
  };*/
  });

  newPost.save(function(err, result) {
    console.log("--- newPost result: ---\n", result);

    if (err !== null) {
      // post не был сохранен!
      res.status(500).json(err);
    } else {
      console.log("----- post saved: -----\n", newPost);
      //console.log(result); Ответ клиенту
      res.status(200).json({ "В базе: \n": result });
    }
  });
};

// ------------------------------- Шаблоны, это всё надо переписать -------------------------------
// кидаю сюда, чтобы в голове не деражть и не искать потом

exports.showPostsByName = function(req, res, next) {
  // todo
  Post.find({ username: req.params.username }, function(err, posts) {
    if (err) {
      console.log(
        "There was an error while loading data from the database: ",
        err
      );
      return res.json({ error: "Couldn't load posts for the user" }, 500);
    }
    res.json({ posts: posts });
    //res.json(posts);
  });
};

exports.showPostsByEmail = function(req, res, next) {
  // todo
  Post.find({ email: req.params.email }, function(err, posts) {
    if (err) {
      console.log(
        "There was an error while loading data from the database: ",
        err
      );
      return res.json({ error: "Couldn't load posts for the user" }, 500);
    }
    res.json({ posts: posts });
    //res.json(posts);
  });
};

exports.showPostsByLast = function(req, res, next) {
  // todo
  Post.find(
    { username: req.params.username },
    null,
    { sort: { created: -1 } },
    function(err, posts) {
      if (err) {
        console.log(
          "There was an error while loading data from the database: ",
          err
        );
        return res.json({ error: "Couldn't load posts for the user" }, 500);
      }
      res.json({ posts: posts });
      //res.json(posts);

      //fs.createReadStream(path.join(UPLOAD_PATH, post.filename)).pipe(res);
    }
  );
};

/******************************************************************************/
/*app.get('/images/:id', async (req, res) => {
    try {
        const col = await loadCollection(COLLECTION_NAME, db);
        const result = col.get(req.params.id);

        if (!result) {
            res.sendStatus(404);
            return;
        };

        res.setHeader('Content-Type', result.mimetype);
        fs.createReadStream(path.join(UPLOAD_PATH, result.filename)).pipe(res);
    } catch (err) {
        res.sendStatus(400);
    }
})

app.get('/images', async (req, res) => {
    try {
        const col = await loadCollection(COLLECTION_NAME, db);
        res.send(col.data);
    } catch (err) {
        res.sendStatus(400);
    }
})

function sendFile(fileName, res) {
    var fileStream = fs.createReadStrem(fileName);
    fileStream
      .on("error", function() {
        res.statusCode = 500;
        res.end("Server error");
      })
      .pipe(res)
      .on("close", function() {
        fileStream.destroy();
      });
  }
*/

/**
 * Что получает парсер:
 * 
FORMIDABLE received upload:

{ fields: { fname: '', age: '' },
  files:
   { photo:
      File {
        _events: {},
        _eventsCount: 0,
        _maxListeners: undefined,
        size: 287567,
        path:
         '/Users/.../storage/img/zorg.jpeg',
        name: 'zorg.jpeg',
        type: 'image/jpeg',
        hash: null,
        lastModifiedDate: 2018-12-11T09:03:04.700Z,
        _writeStream: [WriteStream] } } }
**/
