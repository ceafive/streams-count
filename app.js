const express = require("express");
const logger = require("morgan");
require("dotenv").config();

const indexRouter = require("./routes/index");
const streamsRouter = require("./routes/streams");
const { checkUser } = require("./middlewares");
const seed = require("./seed");
const { winstonlogger } = require("./logger");

//seed db
seed();
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/streams", checkUser, streamsRouter);

app.use((err, req, res, next) => {
  winstonlogger.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
