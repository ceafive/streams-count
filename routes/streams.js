var express = require("express");
const { countCurrentStreams } = require("../controllers");
var router = express.Router();

/* GET users listing. */
router.get("/", countCurrentStreams);

module.exports = router;
