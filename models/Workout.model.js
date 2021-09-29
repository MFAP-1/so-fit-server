const { Schema, model, Types } = require("mongoose");

const WorkoutSchema = new Schema({
  name: { type: String, required: true, trim: true },
  // weekDay: {
  //   type: String,
  //   enum: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  //   default: "MON"
  // },
  exercises: [], // TODO
  userOwnerId: { type: Types.ObjectId, ref: "User" },
});

const WorkoutModel = model("Workout", WorkoutSchema);

module.exports = WorkoutModel;
