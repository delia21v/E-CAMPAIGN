const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    donorName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: "RON" },
    paymentMethod: { type: String, enum: ["simulated"], default: "simulated" },
    status: { type: String, enum: ["confirmed", "pending", "cancelled"], default: "confirmed" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
