const express = require("express");
const router = express.Router();
const VolunteerApplication = require("../models/VolunteerApplication");
const verifyToken = require("../middleware/auth");

router.post("/apply", verifyToken, async (req, res) => {
  try {
    const existing = await VolunteerApplication.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    if (existing) {
      return res.status(400).json({ msg: "Ai trimis deja o cerere de voluntariat" });
    }

    const application = await VolunteerApplication.create({
      ...req.body,
      userId: req.user.id,
      status: "pending",
    });
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ msg: "Cererea nu a putut fi salvată", error: err.message });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const application = await VolunteerApplication.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(application);
  } catch (err) {
    res.status(500).json({ msg: "Eroare la încărcarea cererii de voluntariat" });
  }
});

router.get("/", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: "Doar adminul poate vedea cererile" });

  try {
    const applications = await VolunteerApplication.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .populate("userId", "username");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ msg: "Eroare la încărcarea cererilor" });
  }
});

router.patch("/:id/status", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: "Doar adminul poate modifica statusul" });

  try {
    const application = await VolunteerApplication.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, reviewedAt: new Date() },
      { new: true }
    );
    if (!application) return res.status(404).json({ msg: "Cerere inexistentă" });
    res.json(application);
  } catch (err) {
    res.status(400).json({ msg: "Statusul nu a putut fi actualizat", error: err.message });
  }
});

module.exports = router;
