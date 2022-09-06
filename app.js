const express = require("express");
const path = require("path");
const logger = require("morgan");
require("dotenv").config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const { checkUser } = require("./middlewares");
const { testUsers } = require("./utils");
const { dbSeed } = require("./config/dynamo");

//seed db
dbSeed(testUsers[0]);

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", checkUser, usersRouter);

module.exports = app;
