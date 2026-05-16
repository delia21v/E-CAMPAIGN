const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const verifyToken = require("../middleware/auth");

async function getCampaignDonationProgress(campaignId) {
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) return null;

  const [stats] = await Donation.aggregate([
    { $match: { campaignId: campaign._id, status: "confirmed" } },
    { $group: { _id: "$campaignId", totalAmount: { $sum: "$amount" }, totalCount: { $sum: 1 } } },
  ]);

  const totalAmount = stats?.totalAmount || 0;
  const totalCount = stats?.totalCount || 0;
  const targetAmount = campaign.targetAmount || 0;
  const percentage = targetAmount > 0 ? Math.min(Math.round((totalAmount / targetAmount) * 100), 100) : 0;

  return {
    campaign,
    totalAmount,
    totalCount,
    targetAmount,
    percentage,
    isTargetReached: targetAmount > 0 && totalAmount >= targetAmount,
  };
}

router.post("/", verifyToken, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.body.campaignId);
    if (!campaign) return res.status(404).json({ msg: "Campanie inexistentă" });
    if (campaign.status === "inactive" || campaign.status === "closed") {
      return res.status(400).json({ msg: "Campania este inactivă și nu mai primește donații" });
    }

    const donation = await Donation.create({
      ...req.body,
      userId: req.user.id,
      paymentMethod: "simulated",
      status: "confirmed",
    });

    const progress = await getCampaignDonationProgress(req.body.campaignId);
    if (progress?.isTargetReached) {
      await Campaign.findByIdAndUpdate(req.body.campaignId, { status: "inactive" });
      progress.campaign.status = "inactive";
    }

    res.status(201).json({ donation, progress });
  } catch (err) {
    res.status(400).json({ msg: "Donația nu a putut fi salvată", error: err.message });
  }
});

router.get("/my", verifyToken, async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("campaignId", "title");
    res.json(donations);
  } catch (err) {
    res.status(500).json({ msg: "Eroare la încărcarea donațiilor" });
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
    res.status(500).json({ msg: "Eroare la calcularea donațiilor" });
  }
});

router.get("/stats/by-campaign/:campaignId", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: "Doar adminul poate vedea statisticile" });

  try {
    const progress = await getCampaignDonationProgress(req.params.campaignId);
    if (!progress) return res.status(404).json({ msg: "Campanie inexistentă" });

    const donations = await Donation.find({ campaignId: req.params.campaignId })
      .sort({ createdAt: -1 })
      .populate("userId", "username");

    res.json({ ...progress, donations });
  } catch (err) {
    res.status(500).json({ msg: "Eroare la calcularea donațiilor pe campanie" });
  }
});

router.get("/", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: "Doar adminul poate vedea donațiile" });

  try {
    const donations = await Donation.find()
      .sort({ createdAt: -1 })
      .populate("campaignId", "title")
      .populate("userId", "username");
    res.json(donations);
  } catch (err) {
    res.status(500).json({ msg: "Eroare la încărcarea donațiilor" });
  }
});

module.exports = router;
