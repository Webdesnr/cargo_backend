const mongoose = require("mongoose");
const Joi = require("joi");

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
    type: String,
    required: true,
  },
  fuelType: {
    type: String,
    required: true,
  },
  rcDetails: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Truck = mongoose.model("Truck", TruckModel);

function validateTruck(truck) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    owner: Joi.string().min(3).required(),
    category: Joi.string().required(),
    fuelType: Joi.string().required(),
    rcDetails: Joi.boolean(),
  });
  return schema.validate(truck);
}

module.exports = {
  Truck,
  validateTruck,
};
