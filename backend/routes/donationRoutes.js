const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const verifyToken = require("../middleware/auth");

router.post("/", verifyToken, async (req, res) => {
  try {
    const donation = await Donation.create({
      ...req.body,
      userId: req.user.id,
      paymentMethod: "simulated",
      status: "confirmed",
    });
    res.status(201).json(donation);
  } catch (err) {
    res.status(400).json({ msg: "Donatia nu a putut fi salvata", error: err.message });
  }
});

router.get("/my", verifyToken, async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("campaignId", "title");
    res.json(donations);
  } catch (err) {
    res.status(500).json({ msg: "Eroare la incarcarea donatiilor" });
  }
});

router.get("/stats", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: "Doar adminul poate vedea statisticile" });

  try {
    const [stats] = await Donation.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" }, totalCount: { $sum: 1 } } },
    ]);
    res.json(stats || { totalAmount: 0, totalCount: 0 });
  } catch (err) {
    res.status(500).json({ msg: "Eroare la calcularea donatiilor" });
  }
});

router.get("/", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: "Doar adminul poate vedea donatiile" });

  try {
    const donations = await Donation.find()
      .sort({ createdAt: -1 })
      .populate("campaignId", "title")
      .populate("userId", "username");
    res.json(donations);
  } catch (err) {
    res.status(500).json({ msg: "Eroare la incarcarea donatiilor" });
  }
});

module.exports = router;
