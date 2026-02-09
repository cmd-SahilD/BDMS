import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";

import { rateLimit } from "@/lib/rateLimit";
import { sanitizeInput } from "@/lib/validation";

export async function POST(req) {
    try {
        // Rate limiting: 3 reset requests per hour per IP
        const limiterResults = rateLimit(req, 3, 60 * 60 * 1000);
        if (limiterResults) return limiterResults;

        await connectToDatabase();
        let { email } = await req.json();
        email = sanitizeInput(email);

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                message: "If an account with that email exists, a password reset link has been sent."
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Set token and expiry (1 hour from now)
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);
        await user.save();

        // In a real application, you would send an email here
        // For now, we'll return the token in the response (DEV ONLY)
        // In production, remove the token from response and send via email

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login/reset-password?token=${resetToken}`;

        // Log the reset URL for development purposes
        console.log("Password reset URL:", resetUrl);

        return NextResponse.json({
            message: "If an account with that email exists, a password reset link has been sent.",
            // DEV ONLY - Remove in production
            devResetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}
