var express = require("express");
var router = express.Router();

//var vkAuth = require("../controllers/vkAuth");

/* AUTH */
//router.get("/vkauth", vkAuth);

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
