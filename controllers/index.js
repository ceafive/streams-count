const { increaseStreamsCount } = require("../db");
const { MAX_NO_STREAMS } = require("../utils");

module.exports = {
  countCurrnentStreams: function (req, res, next) {
    const id = req.newStreamUserID;

    // increase user streams
    return increaseStreamsCount(id)
      .then((response) => {
        res.status(200).json({
          success: true,
          message: `Current streams is ${response}`,
        });
      })
      .catch((error) => {
        console.log({ error });
        res.status(400).json({
          success: false,
          message: `Current streams is ${error}. Max number of streams is ${MAX_NO_STREAMS}`,
        });
      });
  },
};
