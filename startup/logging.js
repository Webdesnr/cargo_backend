const config = require("config");
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

module.exports = function () {
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
