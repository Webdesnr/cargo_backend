const mongoose = require("mongoose");
const config = require("config");
const winston = require("winston");

module.exports = function () {
  const db = config.get("database");
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info(`connected to ${db}`));
};
