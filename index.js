const express = require("express");
require("express-async-errors");
const app = express();
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const config = require("config");
const error = require("./middlewares/error");
const trucks = require("./routes/trucks");
const categories = require("./routes/categories");
const users = require("./routes/users");
const login = require("./routes/auth");

mongoose
  .connect(config.get("database.url"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to mongodb"))
  .catch((er) => console.log(er));

if (!process.env.jwtPrivateKey) {
  console.error("JwtPrivateKey is not be empty!");
  process.exit(1);
}

process.on("unhandledRejection", (ex) => {
  throw ex;
});

app.use(express.json());
app.use("/api/trucks", trucks);
app.use("/api/categories", categories);
app.use("/api/users", users);
app.use("/api/login", login);
app.use(error);

const port = config.get("server.port");
app.listen(port, console.log(`listen to the port ${port}`));
