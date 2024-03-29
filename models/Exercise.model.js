const { Schema, model, Types } = require("mongoose");

const ExerciseSchema = new Schema({
  category: {
    type: String,
    enum: ["Cardio", "Bike", "Body-workout", "Rhythm Sports", "Team Sports"],
    required: true,
  },
  exerciseName: {
    type: String,
    enum: [
      "Walking",
      "Running",
      "Cross country",

      "Biking",
      "Mountain bike",

      "Push-up",
      "Pull-up",
      "Chin-up",
      "Lunges",
      "Jumping jack",
      "Squat",
      "Single under",
      "Abs",
      "Leg raise",
      "Mountain climber",
      "Frontal plank",
      "Back plank",
      "Side plank",
      "Skipping",

      "Zumba",
      "Yoga",
      "Spinning",
      "Jumping",

      "Basketball",
      "Football",
      "Tennis",
      "Handball",
      "Volleyball",
    ],
    required: true,
  },
  exerciseReps: { type: Number, min: 1, required: true, default: 1 },
  exerciseTotalPoints: {
    type: Number,
    min: 0,
    default: 0,
  },
  workoutId: { type: Types.ObjectId, ref: "Workout", required: true },
});

function getExercisePoints(exerciseName) {
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
      name: "Cross country",
      points: 0.015,
    },

    {
      name: "Biking",
      points: 0.005,
    },
    {
      name: "Mountain bike",
      points: 0.01,
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
      name: "Abs",
      points: 0.5,
    },
    {
      name: "Leg raise",
      points: 0.5,
    },
    {
      name: "Mountain climber",
      points: 0.25,
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
    {
      name: "Skipping",
      points: 0.1,
    },

    {
      name: "Zumba",
      points: 1.5,
    },
    {
      name: "Yoga",
      points: 1.5,
    },
    {
      name: "Spinning",
      points: 2.0,
    },
    {
      name: "Jumping",
      points: 2.0,
    },

    {
      name: "Basketball",
      points: 2.0,
    },
    {
      name: "Football",
      points: 2.0,
    },
    {
      name: "Tennis",
      points: 1.5,
    },
    {
      name: "Handball",
      points: 2.0,
    },
    {
      name: "Volleyball",
      points: 2.0,
    },
  ];
  return exercisePointsArr.filter((el) => {
    return el.name === exerciseName;
  })[0].points;
}

ExerciseSchema.pre("save", function (next) {
  const points = getExercisePoints(this.exerciseName);
  this.exerciseTotalPoints = this.exerciseReps * points;
  next();
});

ExerciseSchema.post("findOneAndUpdate", function (result) {
  const points = getExercisePoints(result.exerciseName);
  result.exerciseTotalPoints = result.exerciseReps * points;
  result.save();
});

const ExerciseModel = model("Exercise", ExerciseSchema);

module.exports = ExerciseModel;
