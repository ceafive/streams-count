const { MAX_NO_STREAMS, testUsers } = require("../utils");

const currentUsersStreaming = {};

const findUserByID = (id) => {
  return allUsers.find((user) => user?.id === id) || null;
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
