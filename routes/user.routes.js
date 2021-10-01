const router = require("express").Router();
const bcrypt = require("bcryptjs");

const UserModel = require("../models/User.model");
const generateToken = require("../config/jwt.config");
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const salt_rounds = 10;

// Create new user [route 01]
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

// Login route [route 02]
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

// Route to GET the user profile information [route 03]
router.get("/profile", isAuthenticated, attachCurrentUser, (req, res) => {
  try {
    // Check if user is logged using middleware attachCurrentUser
    const loggedInUser = req.currentUser;

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

//Route to UPDATE the profile user information [route 04]
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

module.exports = router;
