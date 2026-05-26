const express = require("express");

const User = require("../models/User");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


const {
  updateProfileImage,
} = require("../controllers/authController");

router.put("/profile-image", protect, updateProfileImage);



// get all users
router.get("/", protect, async (req, res) => {

  try {

    const users = await User.find({
      _id: { $ne: req.user },
    }).select("-password");

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/profile", protect, async (req, res) => {

  try {

    const user = await User.findByIdAndUpdate(

      req.user.id,

      {
        profilePic: req.body.profilePic,
      },

      { new: true }
    );

    res.json(user);

  } catch (error) {

    res.status(500).json({
      message: "Profile update failed",
    });
  }
});

module.exports = router;