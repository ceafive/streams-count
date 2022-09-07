const {
  getUserStreamsCount,
  updateUserStreamsCount,
} = require("../config/dynamo");
const { logger } = require("../logger");
const { MAX_NO_STREAMS } = require("../utils");

const increaseStreamsCount = async (id) => {
  const user = await getUserStreamsCount(id);
  let currentStreams = user?.currentStreams || 0;

  if (currentStreams < MAX_NO_STREAMS) {
    currentStreams = currentStreams + 1;
    user.currentStreams = currentStreams;
    await updateUserStreamsCount({ id, ...user });
    return currentStreams;
  }

  throw currentStreams;
};

module.exports = {
  countCurrentStreams: function (req, res, next) {
    const id = req.newStreamUserID;

    // increase user streams
    return increaseStreamsCount(id)
      .then((streams) => {
        logger.info(
          {
            success: true,
            message: `Current stream is ${streams}`,
          },
          {
            service: "count-streams",
          }
        );

        res.status(200).json({
          success: true,
          message: `Current stream is ${streams}`,
        });
      })
      .catch((streams) => {
        logger.error(
          {
            success: false,
            message: `Current stream is ${streams}. Max number of streams is ${MAX_NO_STREAMS}`,
            userID: id,
          },
          {
            service: "count-streams",
          }
        );

        res.status(401).json({
          success: false,
          message: `Current stream is ${streams}. Max number of streams is ${MAX_NO_STREAMS}`,
        });
      });
  },
};
