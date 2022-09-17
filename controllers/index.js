const { logger } = require("../logger");
const {
  MAX_NO_STREAMS,
  increaseStreamsCount,
  resetStreamsCount,
} = require("../utils");

module.exports = {
  countCurrentStreams: async function (req, res, next) {
    const id = req.newStreamUserID;

    // increase user streams
    try {
      const streams = await increaseStreamsCount(id);
      logger.info(
        {
          success: true,
          message: `Current stream is ${streams}`,
        },
        {
          service: "count-streams",
        }
      );

      return res.status(200).json({
        success: true,
        message: `Current stream is ${streams}`,
      });
    } catch (streams) {
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

      return res.status(401).json({
        success: false,
        message: `Current stream is ${streams}. Max number of streams is ${MAX_NO_STREAMS}`,
      });
    }
  },

  resetUserCount: async (req, res) => {
    try {
      const id = req.newStreamUserID;
      const count = await resetStreamsCount(id);
      return res.status(200).json({
        success: true,
        message: `Stream count reset to ${count}`,
      });
    } catch (error) {
      logger.error(error);
      return res.status(401).json({
        success: false,
        message: error?.message || error,
      });
    }
  },
};
