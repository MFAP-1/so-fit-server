const { Schema, model, Types } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
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
    maxlength: 500,
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
      "https://www.kindpng.com/picc/m/421-4212275_transparent-default-avatar-png-avatar-img-png-download.png",
  },
  soFitPoints: { type: Number, min: 0, default: 0 },
  level: { type: Number, min: 1, default: 1 },
  followingId: [{ type: Types.ObjectId, ref: "User" }], //Precisa ser required?
  followersId: [{ type: Types.ObjectId, ref: "User" }], //Precisa ser required?
});

UserSchema.pre("save", function (next) {
  this.name =
    this.name.trim()[0].toUpperCase() + this.name.slice(1).toLowerCase();

  next();
});

// Updating the level. Checking at every change in the soFiPoints value
function determinateLevelBasedOnPoints(amountOfPoints) {
  const experienceTable = [1000, 2050, 4200, 8600, 17600, 36080, 73000]; // pre-defined required amount of points for leveling up
  let level = 1;
  for (let i = 0; i < experienceTable.length; i++) {
    console.log(amountOfPoints, "pontos no for loop");
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
