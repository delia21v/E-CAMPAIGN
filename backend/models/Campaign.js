const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, default: "social", trim: true },
    goal: { type: String, default: "", trim: true },
    imageUrl: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive", "closed"], default: "active" },
    targetAmount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
