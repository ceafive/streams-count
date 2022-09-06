const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "streams-count-users";

const getUsers = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const users = await scanDynamoRecordsRecursive(params, []);
  console.log(users);
  return users;
};

//doing a recursive because DynamoDB limits records returned in a single query
async function scanDynamoRecordsRecursive(params, array) {
  try {
    const dynamoData = await dynamoClient.scan(params).promise();
    array = array.concat(dynamoData.Items);

    if (dynamoData.LastEvaluatedKey) {
      params.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecordsRecursive(params, array);
    }

    return array;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getUsers,
};
