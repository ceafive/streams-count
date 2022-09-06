const express = require("express");
const path = require("path");
const logger = require("morgan");
require("dotenv").config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const { checkUserHeader } = require("./middlewares");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", checkUserHeader, usersRouter);

app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
