import connectToDatabase from "@/lib/db";
import AuditLog from "@/models/AuditLog";

/**
 * Log a user activity
 * @param {string} userId - ID of the user performing action
 * @param {string} action - Short action name (e.g. "Login")
 * @param {string} details - Detailed description
 * @param {string} icon - "blue" (info), "green" (success/add), "red" (delete)
 */
export async function logActivity(userId, action, details, icon = "blue") {
    try {
        await connectToDatabase();
        await AuditLog.create({
            userId,
            action,
            details,
            icon
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
        // We generally don't want to crash the main request if logging fails
    }
}
