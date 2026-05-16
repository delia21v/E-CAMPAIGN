const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const PetitionSignature = require("../models/PetitionSignature");
const verifyToken = require("../middleware/auth");

router.post("/sign", verifyToken, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.body.campaignId);
    if (!campaign) return res.status(404).json({ msg: "Campanie inexistentă" });
    if (campaign.status === "inactive" || campaign.status === "closed") {
      return res.status(400).json({ msg: "Campania este inactivă și petiția este închisă" });
    }

    const signature = await PetitionSignature.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(signature);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Ai semnat deja această petiție cu acest email" });
    }
    res.status(400).json({ msg: "Semnătura nu a putut fi salvată", error: err.message });
  }
});

router.get("/count/:campaignId", async (req, res) => {
  try {
    const count = await PetitionSignature.countDocuments({ campaignId: req.params.campaignId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: "Eroare la calcularea semnăturilor" });
  }
});

router.get("/signatures/:campaignId", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: "Doar adminul poate vedea semnăturile" });

  try {
    const signatures = await PetitionSignature.find({ campaignId: req.params.campaignId })
      .sort({ createdAt: -1 })
      .populate("userId", "username");
    res.json(signatures);
  } catch (err) {
    res.status(500).json({ msg: "Eroare la încărcarea semnăturilor" });
  }
});

module.exports = router;
