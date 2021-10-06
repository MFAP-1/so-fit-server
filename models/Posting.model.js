const { Schema, model, Types } = require("mongoose");

const PostingSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30
  },
   description: { type: String, trim: true, maxlength: 300 },
   pictureUrl: {
    type: String,
    trim: true,
    default:
      "https://image.freepik.com/free-vector/outdoor-workout-training-healthy-lifestyle-open-air-jogging-fitness-activity-male-athlete-running-park-muscular-sportsman-exercising-outdoors-vector-isolated-concept-metaphor-illustration_335657-1338.jpg",
  },
   workoutId:{type: Types.ObjectId, ref:"Workout"}, 
   postedBy :{type: Types.ObjectId, ref:"User"},
   userId: {type: String},
   createdDate: {type:Date, default:Date.now},
   likes: [{type: Types.ObjectId, ref:"User"}],
   comments:[{
       text: {type:String},
       createdDate:{ type:Date, default:Date.now},
       postedBy : {type: Types.ObjectId, ref:"User"},
       postedByName:{type:String},
       postedByPicture:{type:String},
   }]
});



const PostingModel = model("Posting", PostingSchema);

module.exports = PostingModel;
