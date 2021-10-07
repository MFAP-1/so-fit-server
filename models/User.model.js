const { Schema, model, Types } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 15,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 300,
    required: true,
    default: "Sem descrição",
  },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    required: true,
    default: "USER",
  },
  pictureUrl: {
    type: String,
    trim: true,
    default:
      "https://res.cloudinary.com/djjhqmowr/image/upload/v1633642007/photosSofit/exerciseVector_ivn8zl.png",
  },
  soFitPoints: { type: Number, min: 0, default: 0 },
  level: { type: Number, min: 1, default: 1 },
  followingId: [{ type: Types.ObjectId, ref: "User" }],
  followersId: [{ type: Types.ObjectId, ref: "User" }],
});

UserSchema.pre("save", function (next) {
  this.name =
    this.name.trim()[0].toUpperCase() + this.name.slice(1).toLowerCase();

  next();
});

// Updating the level. Checking at every change in the soFiPoints value
function determinateLevelBasedOnPoints(amountOfPoints) {
  const experienceTable = [
    300, 700, 1000, 1500, 2050, 4200, 8600, 17600, 36080, 73000,
  ]; // pre-defined required amount of points for leveling up
  let level = 1;
  for (let i = 0; i < experienceTable.length; i++) {
    if (amountOfPoints > experienceTable[i]) {
      level = i + 2; // +2 cause in the 0 index is the level up from lvl 1 to 2. And so on.
    }
  }
  return level;
}

UserSchema.post("findOneAndUpdate", function (result) {
  result.level = determinateLevelBasedOnPoints(result.soFitPoints);
  result.save();
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
