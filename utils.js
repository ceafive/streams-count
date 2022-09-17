const {
  getUserStreamsCount,
  updateUserStreamsCount,
} = require("./config/dynamo");
const { logger } = require("./logger");

const MAX_NO_STREAMS = 3;

const testUsers = [
  {
    id: "123",
    name: "Castro",
    createdAt: new Date().getTime(),
  },
  {
    id: "1234",
    name: "Agbo",
    createdAt: new Date().getTime(),
  },
  {
    id: "12345",
    name: "Castro A",
    createdAt: new Date().getTime(),
  },
  {
    id: "123456",
    name: "Castro Agbo",
    createdAt: new Date().getTime(),
  },
];

const increaseStreamsCount = async (id) => {
  const user = await getUserStreamsCount(id);
  let currentStreams = user?.currentStreams || 0;

  if (currentStreams < MAX_NO_STREAMS) {
    currentStreams = currentStreams + 1;
    user.currentStreams = currentStreams;
    await updateUserStreamsCount({ id, currentStreams });
    return currentStreams;
  }

  throw currentStreams;
};

const resetStreamsCount = async (id) => {
  const user = await getUserStreamsCount(id);

  if (!user) {
    throw `User with id ${id} not found`;
  }
  user.currentStreams = 0;
  await updateUserStreamsCount({ id, currentStreams: 0 });
  return 0;
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something broke!");
};

module.exports = {
  increaseStreamsCount,
  resetStreamsCount,
  MAX_NO_STREAMS,
  testUsers,
  errorHandler,
};
