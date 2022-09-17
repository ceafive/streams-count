const { addUsersToDB } = require("./config/dynamo");

module.exports = async (testUsers) => {
  try {
    if (!Array.isArray(testUsers)) throw `Param must be an array`;

    console.log("Seeding.....");
    const promises = testUsers.map((u) => addUsersToDB(u));
    const result = await Promise.all(promises);

    return result;
  } catch (error) {
    return error;
  }
};
