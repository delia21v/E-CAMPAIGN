const express = require("express");
const router = express.Router();
const ForumTopic = require("../models/ForumTopic");
const ForumReply = require("../models/ForumReply");
const verifyToken = require("../middleware/auth");

router.get("/topics", async (req, res) => {
  try {
    const topics = await ForumTopic.find()
      .sort({ createdAt: -1 })
      .populate("authorId", "username")
      .populate("campaignId", "title");
    res.json(topics);
  } catch (err) {
    res.status(500).json({ msg: "Eroare la incarcarea forumului" });
  }
});

router.post("/topics", verifyToken, async (req, res) => {
  try {
    const topic = await ForumTopic.create({
      ...req.body,
      authorId: req.user.id,
    });
    res.status(201).json(topic);
  } catch (err) {
    res.status(400).json({ msg: "Topic-ul nu a putut fi creat", error: err.message });
  }
});

router.get("/topics/:id", async (req, res) => {
  try {
    const topic = await ForumTopic.findById(req.params.id)
      .populate("authorId", "username")
      .populate("campaignId", "title");
    if (!topic) return res.status(404).json({ msg: "Topic inexistent" });

    const replies = await ForumReply.find({ topicId: req.params.id })
      .sort({ createdAt: 1 })
      .populate("authorId", "username");

    res.json({ topic, replies });
  } catch (err) {
    res.status(500).json({ msg: "Eroare la incarcarea topicului" });
  }
});

router.post("/topics/:id/replies", verifyToken, async (req, res) => {
  try {
    const reply = await ForumReply.create({
      topicId: req.params.id,
      body: req.body.body,
      authorId: req.user.id,
    });
    res.status(201).json(reply);
  } catch (err) {
    res.status(400).json({ msg: "Raspunsul nu a putut fi salvat", error: err.message });
  }
});

router.delete("/topics/:id", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: "Doar adminul poate modera forumul" });

  try {
    await ForumReply.deleteMany({ topicId: req.params.id });
    await ForumTopic.findByIdAndDelete(req.params.id);
    res.json({ msg: "Topic sters" });
  } catch (err) {
    res.status(500).json({ msg: "Topic-ul nu a putut fi sters" });
  }
});

router.delete("/replies/:id", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: "Doar adminul poate modera forumul" });

  try {
    await ForumReply.findByIdAndDelete(req.params.id);
    res.json({ msg: "Raspuns sters" });
  } catch (err) {
    res.status(500).json({ msg: "Raspunsul nu a putut fi sters" });
  }
});

module.exports = router;
