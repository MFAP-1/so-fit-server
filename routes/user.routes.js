const router = require("express").Router();
const bcrypt = require("bcryptjs");

const UserModel = require("../models/User.model");
const generateToken = require("../config/jwt.config");
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const salt_rounds = 10;

//Image upload [route 01]
const uploader = require("../config/cloudinary.config");
router.post(
  "/image-upload",
  uploader.single("pictureUrl2"),
  (req, res, next) => {
    if (!req.file) {
      return next(new Error("Image upload Failed"));
    }
    console.log(req.file);
    return res.status(201).json({ url: req.file.path });
  }
);

//Route to view specific user by ID [route 02]
router.get(
  "/user/view/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const user = await UserModel.findOne({ _id: req.params.id });

      return res.status(200).json(user);
    } catch {
      console.error(err);
      return res.status(500).json({ msg: JSON.stringify(err) });
    }
  }
);

// Route to get all users [route 03]
router.get("/users", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json(users);
  } catch {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

//Route to Follow User [route 04]

router.post(
  "/user/view/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      console.log(req.currentUser.followingId.length);
      if (req.currentUser._id == req.params.id) {
        return res.status(400).json("Cannot follow yoursel");
      }

      await UserModel.updateOne(
        { _id: req.currentUser._id },
        { $push: { followingId: req.params.id } }
      );

      await UserModel.updateOne(
        { _id: req.params.id },
        { $push: { followersId: req.currentUser._id } }
      );

      return res.status(201).json("Followed");
    } catch {
      return res.status(500).json({ msg: JSON.stringify(err) });
    }
  }
);

//Route to Unfollow User [route 05]

router.delete(
  "/user/view/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      if (req.currentUser._id == req.params.id) {
        return res.status(400).json("Cannot unfollow yourself");
      }

      await UserModel.updateOne(
        { _id: req.currentUser._id },
        { $pull: { followingId: req.params.id } }
      );

      await UserModel.updateOne(
        { _id: req.params.id },
        { $pull: { followersId: req.currentUser._id } }
      );

      return res.status(201).json("Unfollowed");
    } catch {
      return res.status(500).json({ msg: JSON.stringify(err) });
    }
  }
);

// Create new user [route 06]
router.post("/signup", async (req, res) => {
  try {
    // Recover password from req.body
    const { password } = req.body;

    // Verify Password strength
    if (
      !password ||
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
      )
    ) {
      return res.status(400).json({
        msg: "Password is required and must have at least 8 characters, uppercase and lowercase letters, numbers and special characters.",
      });
    }

    // Generating salt
    const salt = await bcrypt.genSalt(salt_rounds);

    // Encrypting the password to a hash
    const hashedPassword = await bcrypt.hash(password, salt);

    // Saving the user to the database (MongoDB)
    const result = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// Login route [route 07]
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking if the user is in the database by its email
    const user = await UserModel.findOne({ email });

    console.log(user);

    // If user not found, meaning not sign in the database
    if (!user) {
      return res.status(400).json({ msg: "Wrong password or email." });
    }

    // Verifying if the inputed password matchs the one in the database
    if (await bcrypt.compare(password, user.passwordHash)) {
      // Generate JWT token
      const token = generateToken(user);

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
          role: user.role,
        },
        token,
      });
    } else {
      return res.status(401).json({ msg: "Wrong password or email." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// Route to GET the user profile information [route 08]
router.get("/profile", isAuthenticated, attachCurrentUser, (req, res) => {
  try {
    //Populate feito no attachCurrentUser.js
    // Check if user is logged using middleware attachCurrentUser
    const loggedInUser = req.currentUser;
    console.log(loggedInUser);

    if (loggedInUser) {
      return res.status(200).json(loggedInUser);
    } else {
      return res.status(404).json({ msg: "User not found. Please sign up." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

//Route to UPDATE the profile user information [route 09]
router.patch(
  "/profile/edit/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const result = await UserModel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { ...req.body } },
        { new: true, runValidators: true }
      );
      if (!result) {
        return res.status(404).json({ msg: "User not found" });
      }
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }
);

// Route to get all users for the leaderboard [route 10]
router.get("/users-leaderboard/pg/:currentPg", async (req, res) => {
  try {
    const LIMIT = 5;
    const users = await UserModel.find()
      .limit(LIMIT)
      .skip((req.params.currentPg - 1) * LIMIT)
      .sort({ soFitPoints: -1 });
    return res.status(200).json(users);
  } catch {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

module.exports = router;
