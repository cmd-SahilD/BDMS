import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { createToken, setAuthCookie } from "@/lib/auth";
import { logActivity } from "@/lib/logger";

import { rateLimit } from "@/lib/rateLimit";
import { sanitizeInput } from "@/lib/validation";

export async function POST(req) {
    try {
        // Rate limiting: 5 attempts per minute per IP
        const limiterResults = rateLimit(req, 5, 60 * 1000);
        if (limiterResults) return limiterResults;

        await connectToDatabase();

        let { email, password } = await req.json();
        email = sanitizeInput(email);
        password = sanitizeInput(password);

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Check verification status (skip for admins)
        if (!user.isVerified && user.role !== 'admin') {
            return NextResponse.json({ error: "Account is pending admin verification" }, { status: 403 });
        }

        // Generate JWT using centralized auth utility
        const token = await createToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        });

        const response = NextResponse.json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                bloodType: user.bloodType,
                weight: user.weight,
                age: user.age,
                phone: user.phone,
                address: user.address,
                facilityName: user.facilityName,
                licenseNumber: user.licenseNumber,
            }
        }, { status: 200 });

        // Set HTTP-only cookie using centralized auth utility
        setAuthCookie(response, token);

        // Log the login activity
        await logActivity(user._id, "System Access", "Facility logged in successfully", "blue");

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
