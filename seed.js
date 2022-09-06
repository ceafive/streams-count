const { addUsersToDB } = require("./config/dynamo");
const { testUsers } = require("./utils");

module.exports = async () => {
  const promises = testUsers.map((u) => addUsersToDB(u));
  await Promise.all(promises);
};
