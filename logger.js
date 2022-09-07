const winston = require("winston");
const WinstonCloudWatch = require("winston-cloudwatch");

// when you don't provide a name the default one
// is CloudWatch
winston.add(
  new WinstonCloudWatch({
    awsRegion: process.env.DEFAULT_REGION,
    logGroupName: "streams-count",
    logStreamName: "streams-count",
  })
);

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  winston.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

exports.winstonlogger = winston;
