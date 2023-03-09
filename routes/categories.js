const express = require("express");
const router = express.Router();
const validateObjectId = require("../middlewares/validateObjectId")();
const { Category, validateCategory } = require("../models/category");

router.get("/", async (req, res) => {
  const categories = await Category.find({}).select("-__v");
  res.status(200).send(categories);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const category = await Category.findById(req.params.id).select("-__v");
  if (!category) return res.status(404).send("Category not exist");

  res.status(200).send(category);
});

router.post("/", async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.create(req.body);
  res.status(200).send(category);
});

router.put("/:id", validateObjectId, async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!category) return res.status(404).send("Category not exist");

  res.status(200).send(category);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.send("Category not exist").status(404);
  res.send(category).status(200);
});

module.exports = router;
