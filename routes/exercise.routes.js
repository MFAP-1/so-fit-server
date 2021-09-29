const router = require("express").Router();

const express = require("express");
// const router = express.Router();

// const isAuthenticated = require("../middlewares/isAuthenticated");
// const attachCurrentUser = require("../middlewares/attachCurrentUser");

const ExerciseModel = require("../models/Exercise.model");

// const ProjectModel = require("../models/Project.model");

// POST a new exercise [route 01]
router.post("/exercise", async (req, res, next) => {
  try {
    const result = await ExerciseModel.create(req.body);

    // Adicionado a referência da tarefa recém-criada no projeto
    // await ProjectModel.updateOne(
    //   { _id: req.body.projectId },
    //   { $push: { tasks: result._id } }
    // ); // O operador $push serve para adicionar um novo elemento à uma array no documento
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
});

// GET a new exercise by its ID [route 02]
router.get("/exercise/:id", async (req, res, next) => {
  try {
    const result = await ExerciseModel.findOne({ _id: req.params.id });
    if (!result) {
      return res.status(404).json({ msg: "Exercise not found" });
    }
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
});

router.patch("/exercise/edit/:id", async (req, res, next) => {
  try {
    const result = await ExerciseModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true, runValidators: true }
    );
    if (!result) {
      return res.status(404).json({ msg: "Exercise not found" });
    }
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
});

router.delete("/exercise/:id", async (req, res, next) => {
  try {
    const result = await ExerciseModel.deleteOne({ _id: req.params.id });
    if (result.deletedCount < 1) {
      return res.status(404).json({ msg: "Exercise not found" });
    }
    return res.status(200).json({});
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

module.exports = router;
