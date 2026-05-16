const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");
const verifyToken = require("../middleware/auth");

const campaignUploadDir = path.join(__dirname, "../uploads/campaigns");
fs.mkdirSync(campaignUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, campaignUploadDir);
  },
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname).toLowerCase();
    cb(null, `campaign-${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Fisierul trebuie sa fie o imagine"));
    }
    cb(null, true);
  },
});

function ensureAdmin(req, res) {
  if (!req.user?.isAdmin) {
    res.status(403).json({ msg: "Doar adminul poate face aceasta actiune" });
    return false;
  }
  return true;
}

function makeSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function closeCampaignIfTargetReached(campaign) {
  if (!campaign?.targetAmount || campaign.targetAmount <= 0) return campaign;

  const [stats] = await Donation.aggregate([
    { $match: { campaignId: campaign._id, status: "confirmed" } },
    { $group: { _id: "$campaignId", totalAmount: { $sum: "$amount" } } },
  ]);

  if ((stats?.totalAmount || 0) >= campaign.targetAmount && campaign.status === "active") {
    campaign.status = "inactive";
    await campaign.save();
  }

  return campaign;
}

router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ msg: "Eroare la incarcarea campaniilor" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const query = mongoose.isValidObjectId(req.params.id)
      ? { _id: req.params.id }
      : { slug: req.params.id };
    const campaign = await Campaign.findOne(query);
    if (!campaign) return res.status(404).json({ msg: "Campanie inexistenta" });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ msg: "Eroare la incarcarea campaniei" });
  }
});

router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  try {
    const payload = {
      ...req.body,
      slug: req.body.slug || makeSlug(req.body.title || ""),
      targetAmount: Number(req.body.targetAmount || 0),
      imageUrl: req.file ? `/uploads/campaigns/${req.file.filename}` : req.body.imageUrl || "",
      createdBy: req.user.id,
    };
    const campaign = await Campaign.create(payload);
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ msg: "Campania nu a putut fi salvata", error: err.message });
  }
});

router.put("/:id", verifyToken, upload.single("image"), async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  try {
    const payload = { ...req.body };
    if (payload.title && !payload.slug) payload.slug = makeSlug(payload.title);
    if (payload.targetAmount !== undefined) payload.targetAmount = Number(payload.targetAmount || 0);
    if (req.file) payload.imageUrl = `/uploads/campaigns/${req.file.filename}`;
    let campaign = await Campaign.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!campaign) return res.status(404).json({ msg: "Campanie inexistenta" });
    campaign = await closeCampaignIfTargetReached(campaign);
    res.json(campaign);
  } catch (err) {
    res.status(400).json({ msg: "Campania nu a putut fi actualizata", error: err.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ msg: "Campanie stearsa" });
  } catch (err) {
    res.status(500).json({ msg: "Eroare la stergerea campaniei" });
  }
});

module.exports = router;
