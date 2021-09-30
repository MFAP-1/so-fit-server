const router = require("express").Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
// const attachCurrentUser = require("../middlewares/attachCurrentUser");

const ExerciseModel = require("../models/Exercise.model");
const WorkoutModel = require("../models/Workout.model");

// POST a new exercise [route 01]
router.post("/exercise", isAuthenticated, async (req, res, next) => {
  try {
    const result = await ExerciseModel.create(req.body);

    // Adding the exercise to the current workout
    await WorkoutModel.updateOne(
      { _id: req.body.workoutId },
      { $push: { exercisesId: result._id } }
    );
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
});

// GET an exercise by its ID [route 02]
router.get("/exercise/:id", isAuthenticated, async (req, res, next) => {
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

// UPDATE an exercise by its ID [route 03]
router.patch("/exercise/edit/:id", isAuthenticated, async (req, res, next) => {
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

// DELETE a new exercise by its ID [route 04]
router.delete(
  "/exercise/delete/:id",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const result = await ExerciseModel.deleteOne({ _id: req.params.id });
      if (result.deletedCount < 1) {
        return res.status(404).json({ msg: "Exercise not found" });
      }
      return res.status(200).json({});
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
