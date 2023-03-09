const validateObjectId = require("../middlewares/validateObjectId");
const express = require("express");
const router = express.Router();
const { Truck, validateTruck } = require("../models/truck");
const { Category } = require("../models/category");

router.get("/", async (req, res) => {
  const trucks = await Truck.find({});
  res.send(trucks).status(200);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const truck = await Truck.findById(req.params.id).select("-__v");
  if (!truck) return res.status(404).send("Truck doesn't exist");
  res.status(200).send(truck);
});

router.post("/", async (req, res) => {
  const { error } = validateTruck(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(404).send("Invalid category");

  const truck = new Truck({
    name: req.body.name,
    owner: req.body.owner,
    category: {
      _id: category._id,
      name: category.name,
    },
    fuelType: req.body.fuelType,
    rcDetails: req.body.rcDetails,
  });

  await truck.save();

  res.send(truck).status(200);
});

router.put("/:id", validateObjectId, async (req, res) => {
  const { error } = validateTruck(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(404).send("Invalid category");

  const truck = await Truck.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      owner: req.body.owner,
      category: {
        _id: category._id,
        name: category.name,
      },
      fuelType: req.body.fuelType,
      rcDetails: req.body.rcDetails,
    },
    {
      new: true,
    }
  );

  if (!truck) return res.status(404).send("The given Id doesn't exist.");

  res.send(truck);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const truck = await Truck.findByIdAndRemove(req.params.id);

  if (!truck) return res.status(404).send("Truck doesn't exist");

  res.send(truck).status(200);
});

module.exports = router;
