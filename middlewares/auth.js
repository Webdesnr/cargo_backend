const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.headers["x-auth-token"];

  jwt.verify(token, config.get("jwtPrivateKey"), (err, user) => {
    if (err) return res.status(401).send("Invalid user");

    req.user = user;
    next();
  });
};
