const express = require("express");
const app = express();
require("express-async-errors");
const error = require("./middlewares/error");
const mongoose = require("mongoose");
const trucks = require("./routes/trucks");
const categories = require("./routes/categories");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

mongoose
  .connect("mongodb://localhost:27017/backend_cargo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to mongodb"))
  .catch((er) => console.log(er));

process.on("unhandledRejection", (ex) => {
  throw ex;
});

app.use(express.json());
app.use("/api/trucks", trucks);
app.use("/api/categories", categories);
app.use(error);

const port = process.env.port || 3000;
app.listen(port, console.log(`listen to the port ${port}`));