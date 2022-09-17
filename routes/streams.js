var express = require("express");
const { countCurrentStreams, resetUserCount } = require("../controllers");
var router = express.Router();

router.get("/", countCurrentStreams);
router.post("/reset", resetUserCount);

module.exports = router;
