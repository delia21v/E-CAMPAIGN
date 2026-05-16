const mongoose = require("mongoose");

const forumTopicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ForumTopic", forumTopicSchema);
