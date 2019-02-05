var express = require("express");
var router = express.Router();

let postController = require("../controllers/postController");
let authController = require("../controllers/userController");
let access = require("../controllers/accessController");
let requireLogin = access.requireLogin;

/* show page. */
router.get("/", postController.index);
router.get("/dash", requireLogin, authController.dashboard);

/* send data */
//router.post("/", postController.upload); // в SPA без других ресурсов, так было бы красиво
router.post("/upload", postController.upload); // но так понятнее

/* Get Data */
router.get("/commentsByName", postController.showPostsByName);
router.get("/commentsByEmail", postController.showPostsByEmail);
router.get("/commentsByLast", postController.showPostsByLast);

/* AUTH */
router.get("/login", authController.login);
router.post("/login", authController.loginOrRegister);
router.get("/logout", authController.logout); //мб сделать через post?!

module.exports = router;
