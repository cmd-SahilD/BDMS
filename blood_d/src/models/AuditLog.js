import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        action: {
            type: String,
            required: true, // e.g., "Login", "Stock Added", "Camp Scheduled"
        },
        details: {
            type: String, // e.g., "Added 50 units of A+", "Login Successful"
        },
        ip: {
            type: String,
        },
        icon: {
            type: String,
            default: "blue" // blue, green, red
        }
    },
    { timestamps: true }
);

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
