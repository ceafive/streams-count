const AWS = require("aws-sdk");
const { logger } = require("../logger");
const { region, accessKeyID, secretAccessKey } = require("./utils");

AWS.config.update({
  region: region,
  accessKeyId: accessKeyID,
  secretAccessKey: secretAccessKey,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE_NAME = "streams-count-users";
const STREAMS_TABLE_NAME = "streams-count-counts";

const dbSeed = async (user) => {
  try {
    const params = {
      TableName: USERS_TABLE_NAME,
      Item: user,
    };

    return await dynamoClient.put(params).promise();
  } catch (error) {
    logger.error(error);
  }
};

const getUsers = async () => {
  try {
    const params = {
      TableName: USERS_TABLE_NAME,
    };
    return await scanDynamoRecordsRecursive(params, []);
  } catch (error) {
    logger.error(error);
  }
};

const getUserByID = async (id) => {
  try {
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
  } catch (error) {
    logger.error(error);
  }
};

const getUserStreamsCount = async (id) => {
  try {
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
  } catch (error) {
    logger.error(error);
  }
};

const updateUserStreamsCount = async (data) => {
  try {
    const params = {
      TableName: STREAMS_TABLE_NAME,
      Item: data,
    };

    return await dynamoClient.put(params).promise();
  } catch (error) {
    logger.error(error);
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
    logger.error(error);
  }
}

const addUsersToDB = async (data) => {
  try {
    const params = {
      TableName: USERS_TABLE_NAME,
      Item: data,
    };

    await dynamoClient.put(params).promise();
    return data;
  } catch (error) {
    logger.error(error);
    return null;
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
