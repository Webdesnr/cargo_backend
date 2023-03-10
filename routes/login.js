const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validateInput(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(401).send("Invalid email or password");

  const token = user.generateToken();

  res.setHeader("x-auth-token", token).send(token);
});

function validateInput(input) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(input);
}

module.exports = router;
