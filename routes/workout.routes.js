const { ObjectId } = require("mongoose").Types;
const router = require("express").Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const WorkoutModel = require("../models/Workout.model");
const ExerciseModel = require("../models/Exercise.model");

// const ProjectModel = require("../models/Project.model");

// POST a new workout [route 01]
router.post(
  "/workout",
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const result = await WorkoutModel.create({
        ...req.body,
        userOwnerId: req.currentUser._id,
      });
      // Adicionado a referência da tarefa recém-criada no projeto
      // await ProjectModel.updateOne(
      //   { _id: req.body.projectId },
      //   { $push: { tasks: result._id } }
      // ); // O operador $push serve para adicionar um novo elemento à uma array no documento
      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  }
);

// GET all workouts for the user [route 02]
router.get(
  "/workout",
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const result = await WorkoutModel.find({
        userOwnerId: req.currentUser._id,
      });
      if (!result) {
        return res.status(404).json({ msg: "Workout not found" });
      }
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }
);

// GET a workout  by its ID [route 03]
router.get("/workout/:id", isAuthenticated, async (req, res, next) => {
  try {
    const result = await WorkoutModel.findOne({
      _id: req.params.id,
    }).populate("exercisesId");
    if (!result) {
      return res.status(404).json({ msg: "Workout not found" });
    }
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
});

// UPDATE workout by its ID [route 04]
router.patch("/workout/edit/:id", isAuthenticated, async (req, res, next) => {
  try {
    const result = await WorkoutModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true, runValidators: true }
    );
    if (!result) {
      return res.status(404).json({ msg: "Workout not found" });
    }
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
});

// Delete workout by its ID [route 05]
router.delete(
  "/workout/delete/:id",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const result = await WorkoutModel.deleteOne({
        _id: ObjectId(req.params.id),
      });
      if (result.deletedCount < 1) {
        return res.status(404).json({ msg: "Workout not found" });
      }
      await ExerciseModel.deleteMany({ workoutId: ObjectId(req.params.id) });

      return res.status(200).json({});
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
