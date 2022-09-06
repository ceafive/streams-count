"use strict";

const awsServExpress = require("aws-serverless-express");
const app = require("./app");

const server = awsServExpress.createServer(app);

module.exports.api = (event, context) =>
  awsServExpress.proxy(server, event, context);
