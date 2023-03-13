const express = require("express");
const app = express();
const config = require("config");
const winston = require("winston");

require("./startup/logging")();
require("./startup/config")();
require("./startup/db")();
require("./startup/validation")();
require("./startup/routes")(app);
require("./startup/prod")(app);

const port = config.get("server.port");
app.listen(port, winston.info(`listen to the port ${port}`));
