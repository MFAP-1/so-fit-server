const { Schema, model, Types } = require("mongoose");

const WorkoutSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 30 },
  description: { type: String, trim: true, maxlength: 300 },
  status: {
    type: String,
    enum: ["Planned", "Done!"],
    default: "Planned",
    required: true,
    trim: true,
  },
  weekDay: {
    type: String,
    enum: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  },
  // references to other schemas
  exercisesId: [{ type: Types.ObjectId, ref: "Exercise" }],
  userOwnerId: { type: Types.ObjectId, ref: "User", required: true },
  workoutPoints: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
});

const WorkoutModel = model("Workout", WorkoutSchema);

module.exports = WorkoutModel;
