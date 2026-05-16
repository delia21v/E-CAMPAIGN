const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Campaign = require("../models/Campaign");
const verifyToken = require("../middleware/auth");

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

router.post("/", verifyToken, async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  try {
    const payload = {
      ...req.body,
      slug: req.body.slug || makeSlug(req.body.title || ""),
      createdBy: req.user.id,
    };
    const campaign = await Campaign.create(payload);
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ msg: "Campania nu a putut fi salvata", error: err.message });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  try {
    const payload = { ...req.body };
    if (payload.title && !payload.slug) payload.slug = makeSlug(payload.title);
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!campaign) return res.status(404).json({ msg: "Campanie inexistenta" });
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
