const { Schema, model, Types } = require("mongoose");

const PostingSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  description: { type: String, trim: true, maxlength: 300 },
  pictureUrl: {
    type: String,
    trim: true,
    default:
      "https://res.cloudinary.com/djjhqmowr/image/upload/v1633642015/photosSofit/20944529_hbqvm9.jpg",
  },
  workoutId: { type: Types.ObjectId, ref: "Workout" },
  postedBy: { type: Types.ObjectId, ref: "User" },
  userId: { type: String },
  createdDate: { type: Date, default: Date.now },
  likes: [{ type: Types.ObjectId, ref: "User" }],
  comments: [
    {
      text: { type: String },
      createdDate: { type: Date, default: Date.now },
      postedBy: { type: Types.ObjectId, ref: "User" },
      postedByName: { type: String },
      postedByPicture: { type: String },
    },
  ],
});

const PostingModel = model("Posting", PostingSchema);

module.exports = PostingModel;
