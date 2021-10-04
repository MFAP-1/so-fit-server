const { ObjectId } = require("mongoose").Types;
const router = require("express").Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const PostingModel = require("../models/Posting.model")



// CREATE a new posting [route 01]
router.post(
    "/posting/:id",
    isAuthenticated,
    attachCurrentUser,
    async (req, res, next) => {
      try {
        const result = await PostingModel.create({
          ...req.body}
        )
         return res.status(201).json(result);
      } catch (err) {
        return next(err);
      }
    }
  );


// GET information of posting [route 02]
router.get(
    "/posting/:id",
    isAuthenticated,
    attachCurrentUser,
    async (req, res, next) => {
      try {
        const result = await PostingModel.findOne({
          _id: req.params.id
        }).populate("workoutId") 
        .populate("postedBy" ) 
        if (!result) {
            return res.status(404).json({ msg: "Posting not found" });
          }
          return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    }
  );


// UPDATE posting by its ID [route 03]
router.patch("/posting/edit/:id", isAuthenticated, async (req, res, next) => {
    try {
      const result = await PostingModel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { ...req.body } },
        { new: true, runValidators: true }
      );
      if (!result) {
        return res.status(404).json({ msg: "Posting not found" });
      }
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  });

  
  // Delete posting by its ID [route 04]
  router.delete(
    "/posting/delete/:id",
    isAuthenticated,
    async (req, res, next) => {
      try {
        const result = await PostingModel.deleteOne({
          _id: req.params.id,
        });
        if (result.deletedCount < 1) {
          return res.status(404).json({ msg: "posting not found" });
        }
        return res.status(200).json({});
      } catch (err) {
        return next(err);
      }
    }
  );

// Get all postings [route 05]
  router.get(
    "/postings",
    isAuthenticated,
    attachCurrentUser,
    async (req, res, next) => {
      try {
        const result = await PostingModel.find().populate("workoutId") 
        .populate("postedBy" ) 
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    }
  );



 module.exports = router;
