const express = require("express");
const mongoose = require("mongoose");
const User = require("../db/userModel");

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name");
    res.json(users);
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
