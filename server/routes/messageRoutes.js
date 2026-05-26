const express = require("express");

const Message = require("../models/Message");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// send message
router.post("/", protect, async (req, res) => {

  try {

    const { receiver, message } = req.body;

    const newMessage = await Message.create({
      sender: req.user,
      receiver,
      message,
    });

    res.status(201).json(newMessage);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});


// get messages
router.get("/:id", protect, async (req, res) => {

  try {

    const messages = await Message.find({
      $or: [
        {
          sender: req.user,
          receiver: req.params.id,
        },
        {
          sender: req.params.id,
          receiver: req.user,
        },
      ],
    });

    res.json(messages);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;