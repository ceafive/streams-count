const { createLogger, transports, format } = require("winston");
const WinstonCloudWatch = require("winston-cloudwatch");
const {
  accessKeyID,
  secretAccessKey,
  region,
  environment,
} = require("./config/utils");

const customLogger = createLogger();
const winston = customLogger;

if (environment !== "production") {
  winston.add(
    new transports.File({
      filename: "streams.log",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    })
  );
  winston.add(
    new transports.File({
      filename: "streams-error.log",
      level: "error",
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
        format.prettyPrint()
      ),
    })
  );
}

if (environment === "production") {
  // when you don't provide a name the default one is CloudWatch

  winston.add(
    new WinstonCloudWatch({
      awsOptions: {
        credentials: {
          accessKeyId: accessKeyID,
          secretAccessKey: secretAccessKey,
        },
        region: region,
      },
      awsRegion: region,
      accessKeyId: accessKeyID,
      secretAccessKey: secretAccessKey,
      logGroupName: "streams-count-api",
      logStreamName:
        new Date().toISOString().split("T")[0] + "/" + "count-streams",
      level: "debug",
      jsonMessage: true,
    })
  );
}

exports.logger = winston;
