const express = require("express");
const logger = require("morgan");
require("dotenv").config();

const indexRouter = require("./routes/index");
const streamsRouter = require("./routes/streams");
const { checkUser } = require("./middlewares");
const seed = require("./seed");

//seed db
seed();
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/streams", checkUser, streamsRouter);

module.exports = app;
