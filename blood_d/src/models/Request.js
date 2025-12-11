import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
    {
        requesterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Requesting Hospital
            required: true,
        },
        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Fulfilling Lab/Hospital
        },
        bloodType: {
            type: String,
            required: true,
        },
        units: {
            type: Number,
            required: true,
            min: 1,
        },
        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected", "Completed", "Cancelled"],
            default: "Pending",
        },
        requestDate: {
            type: Date,
            default: Date.now,
        },
        processedDate: {
            type: Date,
        },
        notes: {
            type: String,
        }
    },
    { timestamps: true }
);

export default mongoose.models.Request || mongoose.model("Request", RequestSchema);
