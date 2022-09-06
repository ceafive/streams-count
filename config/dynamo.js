const AWS = require("aws-sdk");
const { winstonlogger } = require("../logger");

AWS.config.update({
  region: process.env.DEFAULT_REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
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
    winstonlogger.log(error);
  }
};

const getUsers = async () => {
  try {
    const params = {
      TableName: USERS_TABLE_NAME,
    };
    return await scanDynamoRecordsRecursive(params, []);
  } catch (error) {
    winstonlogger.log(error);
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
    winstonlogger.log(error);
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
    winstonlogger.log(error);
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
    winstonlogger.log(error);
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
    winstonlogger.log(error);
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
    winstonlogger.log(error);
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
