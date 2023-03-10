const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const { User, validateUser } = require("../models/user");
const validateObjectId = require("../middlewares/validateObjectId")();

router.get("/", async (req, res) => {
  const users = await User.find({});
  res.status(200).send(users);
});

router.get("/me", async (req, res) => {
  const token = req.headers["x-auth-token"];
  const user = jwt.decode(token);
  res.status(200).send(_.pick(user, ["username", "isAdmin"]));
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const hashPassword = await bcrypt.hash(req.body.password, 10);
  req.body.password = hashPassword;

  let user = await User.create(req.body);
  user = _.pick(user, ["_id", "username", "isAdmin"]);

  const token = jwt.sign(user, config.get("jwtPrivateKey"));
  res.setHeader("x-auth-token", token);

  res.status(200).send(user);
});

router.put("/:id", validateObjectId, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.send(error.details[0].message).status(400);

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).send(user);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(200).send(user);
});

module.exports = router;
