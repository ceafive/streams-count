const { MAX_NO_STREAMS } = require("../utils");

const currentUsersStreaming = {};
const allUsers = [
  {
    id: "123456",
    name: "Castro Agbo",
    createdAt: new Date("2022-09-12"),
  },
];

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
  db: allUsers,
  currentUsersStreaming,
  findUserByID,
  increaseStreamsCount,
};
