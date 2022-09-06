var express = require("express");
const { countCurrnentStreams } = require("../controllers");
var router = express.Router();

/* GET users listing. */
router.get("/", countCurrnentStreams);

module.exports = router;
