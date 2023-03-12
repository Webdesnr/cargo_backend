const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validateUser } = require("../models/user");
const validateObjectId = require("../middlewares/validateObjectId")();
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

router.get("/", auth, async (req, res) => {
  const users = await User.find({});
  res.status(200).send(users);
});

router.get("/me", auth, async (req, res) => {
  const user = req.user;
  res.status(200).send(_.pick(user, ["username", "isAdmin"]));
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = User.findOne({ email: req.body.email });
  if (user) return res.status(409).send("User already exists");

  const hashPassword = await bcrypt.hash(req.body.password, 10);
  req.body.password = hashPassword;

  user = await User.create(req.body);
  const token = user.generateToken();

  res.setHeader("x-auth-token", token);

  user = _.pick(user, ["_id", "email", "username"]);
  res.status(200).send(user);
});

router.put("/:id", [auth, admin], validateObjectId, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.send(error.details[0].message).status(400);

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).send(user);
});

router.delete("/:id", [auth, admin], validateObjectId, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(200).send(user);
});

module.exports = router;
