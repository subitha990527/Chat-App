const express = require("express");
const multer = require("multer");
const User = require("../models/User");

const router = express.Router();

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({ storage });

router.post(
  "/profile",
  upload.single("image"),
  async (req, res) => {

    try {

      const userId = req.body.userId;

      const imagePath =
        `http://localhost:5000/uploads/${req.file.filename}`;

      const updatedUser =
        await User.findByIdAndUpdate(
          userId,
          {
            profileImage: imagePath,
          },
          { new: true }
        );

      res.json(updatedUser);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;