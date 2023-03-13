const express = require("express");
require("express-async-errors");
const app = express();
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const config = require("config");
const winston = require("winston");
require("winston-mongodb");
const error = require("./middlewares/error");
const trucks = require("./routes/trucks");
const categories = require("./routes/categories");
const users = require("./routes/users");
const login = require("./routes/login");

winston.exceptions.handle(
  new winston.transports.File({ filename: "log/unCaughtExceptions.log" })
);

winston.add(new winston.transports.File({ filename: "log/app.log" }));
winston.add(
  new winston.transports.MongoDB({
    db: config.get("database.url"),
    options: { useUnifiedTopology: true },
    collection: "logs",
    level: "error",
  })
);
winston.add(
  new winston.transports.File({ filename: "log/error.log", level: "error" })
);

process.on("unhandledRejection", (ex) => {
  throw ex;
});

if (!config.get("jwtPrivateKey")) {
  winston.error("FATAL ERROR:jwtPrivateKey is not defined!");
  // process.exit(1);
  return;
}

mongoose
  .connect(config.get("database.url"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to mongodb"));

app.use(express.json());
app.use("/api/trucks", trucks);
app.use("/api/categories", categories);
app.use("/api/users", users);
app.use("/api/login", login);
app.use(error);

const port = config.get("server.port");
app.listen(port, console.log(`listen to the port ${port}`));
