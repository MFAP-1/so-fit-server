const { Schema, model, Types } = require("mongoose");

const WorkoutSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true, maxlength: 500 },
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
});

const WorkoutModel = model("Workout", WorkoutSchema);

module.exports = WorkoutModel;
