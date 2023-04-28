const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 10,
    uppercase: true,
    require: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(10).required(),
  });

  return schema.validate(category);
}

exports.Category = Category;
exports.categorySchema = categorySchema;
exports.validateCategory = validateCategory;
