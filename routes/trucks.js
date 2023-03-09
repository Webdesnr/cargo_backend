const express = require("express");
const router = express.Router();
const validateObjectId = require("../middlewares/validateObjectId")();
const { Truck, validateTruck } = require("../models/truck");

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

  const truck = await Truck.create(req.body);
  res.send(truck).status(200);
});

router.put("/:id", validateObjectId, async (req, res) => {
  const { error } = validateTruck(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const truck = await Truck.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!truck) return res.status(404).send("The given Id doesn't exist.");

  res.send(truck);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const truck = await Truck.findByIdAndRemove(req.params.id);

  if (!truck) return res.status(404).send("Truck doesn't exist");

  res.send(truck).status(200);
});

module.exports = router;
