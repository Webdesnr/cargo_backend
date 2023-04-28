const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.headers["x-auth-token"];
  if (!token) return res.status(401).send("Access Denied!");

  jwt.verify(token, config.get("jwtPrivateKey"), (err, user) => {
    if (err) return res.status(400).send("Invalid user");

    req.user = user;
    next();
  });
};
