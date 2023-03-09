const mongoose = require("mongoose");
const Joi = require("joi");
const { categorySchema } = require("./category");

const TruckModel = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
  },
  owner: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
  },
  category: {
    type: categorySchema,
    required: true,
  },
  fuelType: {
    type: String,
    required: true,
  },
  rcDetails: {
    type: Boolean,
    default: false,
  },
});

const Truck = mongoose.model("Truck", TruckModel);

function validateTruck(truck) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    owner: Joi.string().min(3).required(),
    categoryId: Joi.objectId(),
    fuelType: Joi.string().required(),
    rcDetails: Joi.boolean(),
  });
  return schema.validate(truck);
}

exports.Truck = Truck;
exports.validateTruck = validateTruck;
