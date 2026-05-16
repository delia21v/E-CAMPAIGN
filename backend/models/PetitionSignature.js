const mongoose = require("mongoose");

const petitionSignatureSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    city: { type: String, required: true, trim: true },
    message: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

petitionSignatureSchema.index({ campaignId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("PetitionSignature", petitionSignatureSchema);
