var express = require("express");
var router = express.Router();

var logicController = require("../controllers/logic");
//var checkAuth = require("../controllers/checkAuth");

/* GET homepage. */
router.get("/", function(req, res, next) {
  res.render("index");
});

/* POST homepage. */
router.post("/", /* checkAuth */ logicController);

module.exports = router;
