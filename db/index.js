const { getUserByID } = require("../config/dynamo");
const { MAX_NO_STREAMS, testUsers } = require("../utils");

const currentUsersStreaming = {};

const findUserByID = async (id) => {
  return await getUserByID(id);
};

const increaseStreamsCount = async (id) => {
  const user = currentUsersStreaming[id] || {};
  let currentStreams = user?.currentStreams || 0;

  if (currentStreams < MAX_NO_STREAMS) {
    currentStreams = currentStreams + 1;
    user.currentStreams = currentStreams;
    currentUsersStreaming[id] = user;
    return currentStreams;
  }

  throw currentStreams;
};

module.exports = {
  db: testUsers,
  currentUsersStreaming,
  findUserByID,
  increaseStreamsCount,
};
