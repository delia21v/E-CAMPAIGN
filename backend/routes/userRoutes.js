const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ msg: "Utilizator deja existent" });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hash });
    await user.save();
    res.json({ msg: "Utilizator inregistrat cu succes" });
  } catch (err) {
    res.status(500).json({ msg: "Eroare la inregistrare" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "Utilizator inexistent" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ msg: "Parola gresita" });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
    res.json({ token, username: user.username, isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ msg: "Eroare la autentificare" });
  }
});

module.exports = router;
