const config = require("config");
const winston = require("winston");
// require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.File({ filename: "unCaughtExceptions.log" })
  );

  winston.add(new winston.transports.File({ filename: "app.log" }));
  // winston.add(
  //   new winston.transports.MongoDB({
  //     db: config.get("database"),
  //     options: { useUnifiedTopology: true },
  //     collection: "logs",
  //     level: "error",
  //   })
  // );
  winston.add(
    new winston.transports.File({ filename: "error.log", level: "error" })
  );
  winston.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
