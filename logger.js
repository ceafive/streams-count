const { createLogger, transports, format } = require("winston");
const WinstonCloudWatch = require("winston-cloudwatch");

const customLogger = createLogger();
const winston = customLogger;

if (process.env.NODE_ENV !== "production") {
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

if (process.env.NODE_ENV === "production") {
  // when you don't provide a name the default one
  // is CloudWatch
  winston.add(
    new WinstonCloudWatch({
      awsOptions: {
        credentials: {
          accessKeyId: process.env.ACCESS_KEY_ID,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
        region: process.env.DEFAULT_REGION,
      },
      awsRegion: process.env.DEFAULT_REGION,
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      logGroupName: "streams-count-api",
      logStreamName:
        new Date().toISOString().split("T")[0] + "/" + "count-streams",
      level: "debug",
      jsonMessage: true,
    })
  );
}

exports.logger = winston;
