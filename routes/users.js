const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.create(req.body);
  res.status(200).send(user);
});

module.exports = router;
