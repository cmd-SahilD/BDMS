import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    type: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    units: {
      type: Number,
      default: 1,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Completed", "Pending", "Cancelled"],
      default: "Completed",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Donation || mongoose.model("Donation", DonationSchema);
