const { Schema, model, Types } = require("mongoose");

const ExerciseSchema = new Schema({
  category: {
    type: String,
    enum: ["Cardio", "Bike", "Body-workout"],
    required: true,
  },
  exerciseName: {
    type: String,
    enum: [
      "Walking",
      "Running",
      "Biking",
      "Push-up",
      "Pull-up",
      "Chin-up",
      "Abs",
      "Lunges",
      "Jumping jack",
      "Squat",
      "Single under",
      "Frontal plank",
      "Back plank",
      "Side plank",
    ],
    required: true,
  },
  exerciseReps: { type: Number, min: 0, required: true, default: 1 },
  exerciseTotalPoints: { type: Number, min: 0, default: 0 },
  WorkoutId: { type: Types.ObjectId, ref: "Workout" },
});

ExerciseSchema.pre("save", function (next) {
  const exercisePointsArr = [
    {
      name: "Walking",
      points: 0.01,
    },
    {
      name: "Running",
      points: 0.015,
    },
    {
      name: "Biking",
      points: 0.005,
    },
    {
      name: "Push-up",
      points: 1.0,
    },
    {
      name: "Pull-up",
      points: 2.0,
    },
    {
      name: "Chin-up",
      points: 2.0,
    },
    {
      name: "Abs",
      points: 0.5,
    },
    {
      name: "Lunges",
      points: 0.5,
    },
    {
      name: "Jumping jack",
      points: 0.2,
    },
    {
      name: "Squat",
      points: 0.2,
    },
    {
      name: "Single under",
      points: 0.01,
    },
    {
      name: "Frontal plank",
      points: 0.1,
    },
    {
      name: "Back plank",
      points: 0.1,
    },
    {
      name: "Side plank",
      points: 0.1,
    },
  ];
  const filteredObj = exercisePointsArr.filter((el) => {
    return el.name === this.exerciseName;
  });

  // run the calculation:
  this.exerciseTotalPoints += this.exerciseReps * filteredObj[0].points;
  next();
});

const ExerciseModel = model("Exercise", ExerciseSchema);

module.exports = ExerciseModel;
