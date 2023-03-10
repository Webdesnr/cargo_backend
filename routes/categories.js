const express = require("express");
const admin = require("../middlewares/admin");
const router = express.Router();
const validateObjectId = require("../middlewares/validateObjectId")();
const auth = require("../middlewares/auth");
const { Category, validateCategory } = require("../models/category");
const { Truck } = require("../models/truck");

async function updateCategoryInTruck(category) {
  const trucks = await Truck.find({ category });
  const { name } = await Category.findById(category._id).select("-_id name");
  trucks.map(async (truck) => {
    await Truck.findByIdAndUpdate(truck._id, {
      category: { _id: category._id, name },
    });
  });
}

router.get("/", async (req, res) => {
  const categories = await Category.find({}).select("-__v");
  res.status(200).send(categories);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const category = await Category.findById(req.params.id).select("-__v");
  if (!category) return res.status(404).send("Category not exist");

  res.status(200).send(category);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.create(req.body);
  res.status(200).send(category);
});

router.put("/:id", auth, validateObjectId, async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).select("-__v");

  if (!category) return res.status(404).send("Category not exist");

  updateCategoryInTruck(category);
  res.status(200).send(category);
});

router.delete("/:id", validateObjectId, [auth, admin], async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.send("Category not exist").status(404);
  res.send(category).status(200);
});

module.exports = router;
