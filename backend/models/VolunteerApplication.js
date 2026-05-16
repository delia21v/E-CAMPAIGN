const mongoose = require("mongoose");

const volunteerApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 14 },
    motivation: { type: String, required: true, trim: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reviewedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("VolunteerApplication", volunteerApplicationSchema);
