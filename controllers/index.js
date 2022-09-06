const {
  getUserStreamsCount,
  updateUserStreamsCount,
} = require("../config/dynamo");
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
        res.status(200).json({
          success: true,
          message: `Current streams is ${streams}`,
        });
      })
      .catch((streams) => {
        res.status(401).json({
          success: false,
          message: `Current streams is ${streams}. Max number of streams is ${MAX_NO_STREAMS}`,
        });
      });
  },
};
