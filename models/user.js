const Joi = require("joi");
const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: true,
    },
    username: {
      type: String,
      minlength: 3,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  })
);

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(255).required(),
    username: Joi.string().min(3).required(),
    isAdmin: Joi.boolean(),
  });

  return schema.validate(user);
}

module.exports = { User, validateUser };
