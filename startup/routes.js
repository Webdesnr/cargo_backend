const express = require("express");
const error = require("../middlewares/error");
const trucks = require("../routes/trucks");
const categories = require("../routes/categories");
const users = require("../routes/users");
const login = require("../routes/login");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/trucks", trucks);
  app.use("/api/categories", categories);
  app.use("/api/users", users);
  app.use("/api/login", login);
  app.use(error);
};
