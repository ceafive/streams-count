const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const indexRouter = require("./routes/index");
const streamsRouter = require("./routes/streams");
const { checkUser } = require("./middlewares");
const helmet = require("helmet");
const cors = require("cors");
const { errorHandler } = require("./utils");

//seed db
// seed(testUsers);
const app = express();

//Set security-related HTTP response headers
app.use(helmet());
app.use(cors());

// this is one step of security to not show server powering details to hackers. not entirely foolproof, but it's a good to have
app.disable("x-powered-by");

app.use(
  morgan(
    `:remote-addr "user-token :req[X-ID]" :date[web] ":method :url" :status :response-time ms ":user-agent"`
  )
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/streams", checkUser, streamsRouter);

app.use(errorHandler);

module.exports = app;
