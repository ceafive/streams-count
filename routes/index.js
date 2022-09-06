var express = require("express");
const { getUsers } = require("../config/dynamo");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  getUsers();
  res.status(200).send("ITS WORKING");
});

module.exports = router;
