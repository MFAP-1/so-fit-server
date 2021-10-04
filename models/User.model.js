const { Schema, model, Types } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30
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
    required:true,
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
  followingId:[{type: Types.ObjectId, ref:"User"}], 
  followersId :[{type: Types.ObjectId, ref:"User"}] 
  
});


UserSchema.pre("save", function (next) {
  this.name =
    this.name.trim()[0].toUpperCase() + this.name.slice(1).toLowerCase();
 
  next();
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
