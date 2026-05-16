const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const PetitionSignature = require("../models/PetitionSignature");
const verifyToken = require("../middleware/auth");

router.post("/sign", verifyToken, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.body.campaignId);
    if (!campaign) return res.status(404).json({ msg: "Campanie inexistenta" });
    if (campaign.status === "inactive" || campaign.status === "closed") {
      return res.status(400).json({ msg: "Campania este inactiva si petitia este inchisa" });
    }

    const signature = await PetitionSignature.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(signature);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Ai semnat deja aceasta petitie cu acest email" });
    }
    res.status(400).json({ msg: "Semnatura nu a putut fi salvata", error: err.message });
  }
});

router.get("/count/:campaignId", async (req, res) => {
  try {
    const count = await PetitionSignature.countDocuments({ campaignId: req.params.campaignId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: "Eroare la calcularea semnaturilor" });
  }
});

router.get("/signatures/:campaignId", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: "Doar adminul poate vedea semnaturile" });

  try {
    const signatures = await PetitionSignature.find({ campaignId: req.params.campaignId })
      .sort({ createdAt: -1 })
      .populate("userId", "username");
    res.json(signatures);
  } catch (err) {
    res.status(500).json({ msg: "Eroare la incarcarea semnaturilor" });
  }
});

module.exports = router;
