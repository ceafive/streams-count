const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const indexRouter = require("./routes/index");
const streamsRouter = require("./routes/streams");
const { checkUser } = require("./middlewares");
const seed = require("./seed");
const { logger } = require("./logger");

//seed db
seed();
const app = express();

app.use(
  morgan(
    process.env.NODE_ENV === "production"
      ? `:remote-addr "user-token :req[X-ID]" :date[web] ":method :url" :status :response-time ms ":user-agent"`
      : `:method :url "user-token :req[X-ID]" :status :response-time ms :date[web]`
  )
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/streams", checkUser, streamsRouter);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
