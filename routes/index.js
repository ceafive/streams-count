var express = require("express");
const { getUsers } = require("../config/dynamo");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("IT'S WORKING");
});

module.exports = router;
