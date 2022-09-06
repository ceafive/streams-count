const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.DEFAULT_REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE_NAME = "streams-count-users";
const STREAMS_TABLE_NAME = "streams-count-counts";

const dbSeed = async (user) => {
  const params = {
    TableName: USERS_TABLE_NAME,
    Item: user,
  };

  return await dynamoClient.put(params).promise();
};

const getUsers = async () => {
  const params = {
    TableName: USERS_TABLE_NAME,
  };
  return await scanDynamoRecordsRecursive(params, []);
};

const getUserByID = async (id) => {
  const params = {
    TableName: USERS_TABLE_NAME,
    Key: {
      id,
    },
  };

  return await dynamoClient
    .get(params)
    .promise()
    .then((res) => res.Item || null);
};

const getUserStreamsCount = async (id) => {
  const params = {
    TableName: STREAMS_TABLE_NAME,
    Key: {
      id,
    },
  };

  return await dynamoClient
    .get(params)
    .promise()
    .then((res) => res.Item || {});
};

const updateUserStreamsCount = async (data) => {
  try {
    const params = {
      TableName: STREAMS_TABLE_NAME,
      Item: data,
    };

    return await dynamoClient.put(params).promise();
  } catch (error) {
    console.log(error);
  }
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

const addUsersToDB = async (data) => {
  try {
    const params = {
      TableName: USERS_TABLE_NAME,
      Item: data,
    };

    return await dynamoClient.put(params).promise();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  dbSeed,
  getUsers,
  getUserByID,
  getUserStreamsCount,
  updateUserStreamsCount,
  addUsersToDB,
};
