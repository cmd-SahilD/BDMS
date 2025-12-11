import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
    {
        facilityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        bloodType: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            required: true,
        },
        units: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        expiryDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["Adequate", "Low", "Critical", "Surplus"],
            default: "Adequate",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema);
