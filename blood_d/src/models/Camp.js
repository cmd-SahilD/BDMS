import mongoose from "mongoose";

const CampSchema = new mongoose.Schema(
    {
        organizerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Lab or Org
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        expectedDonors: {
            type: Number,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
            default: "Upcoming",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Camp || mongoose.model("Camp", CampSchema);
