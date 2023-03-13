const mongoose = require("mongoose");
const config = require("config");
const winston = require("winston");

module.exports = function () {
  mongoose
    .connect(config.get("database.url"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info("connected to mongodb"));
};
