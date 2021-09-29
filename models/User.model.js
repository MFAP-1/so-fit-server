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
});

UserSchema.pre("save", function (next) {
  this.name =
    this.name.trim()[0].toUpperCase() + this.name.slice(1).toLowerCase();
  // if (this.description === "") {
  //   this.description = "O produto '" + this.name + "' ainda não tem descrição.";
  // }
  next();
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
