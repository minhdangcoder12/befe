const express = require("express");
const mongoose = require("mongoose");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/counts", async (req, res) => {
  try {
    const users = await User.find({}, "_id");
    const allPhotos = await Photo.find({});

    const counts = users.map((user) => {
      const userId = user._id.toString();

      const photoCount = allPhotos.filter(
        (p) => p.user_id.toString() === userId
      ).length;

      let commentCount = 0;
      allPhotos.forEach((photo) => {
        photo.comments.forEach((comment) => {
          if (comment.user_id.toString() === userId) commentCount++;
        });
      });

      return { _id: user._id, photoCount, commentCount };
    });

    res.json(counts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/userComments/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  try {
    const allPhotos = await Photo.find({});
    const result = [];

    allPhotos.forEach((photo) => {
      photo.comments.forEach((comment) => {
        if (comment.user_id.toString() === req.params.id) {
          result.push({
            comment: comment.comment,
            date_time: comment.date_time,
            _id: comment._id,
            photo: {
              _id: photo._id,
              file_name: photo.file_name,
              date_time: photo.date_time,
              user_id: photo.user_id,
            },
          });
        }
      });
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  try {
    const user = await User.findById(
      req.params.id,
      "_id first_name last_name location description occupation"
    );
    if (!user) return res.status(400).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
