const mongoose = require("mongoose");
const Joi = require("joi");

const Category = mongoose.model(
  "Category",
  new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      uppercase: true,
      require: true,
    },
  })
);

function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(category);
}

module.exports = { Category, validateCategory };
