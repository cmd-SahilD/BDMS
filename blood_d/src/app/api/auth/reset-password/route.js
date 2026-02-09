import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/rateLimit";
import { sanitizeInput } from "@/lib/validation";

export async function POST(req) {
    try {
        // Rate limiting: 5 reset attempts per hour per IP
        const limiterResults = rateLimit(req, 5, 60 * 60 * 1000);
        if (limiterResults) return limiterResults;

        await connectToDatabase();
        let { token, newPassword } = await req.json();
        token = sanitizeInput(token);
        newPassword = sanitizeInput(newPassword);

        if (!token || !newPassword) {
            return NextResponse.json(
                { error: "Token and new password are required" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Hash the token to compare with stored hash
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user with valid token and not expired
        const user = await User.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpiry: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired reset token" },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        return NextResponse.json({
            message: "Password has been reset successfully. You can now login with your new password."
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { error: "Failed to reset password" },
            { status: 500 }
        );
    }
}
