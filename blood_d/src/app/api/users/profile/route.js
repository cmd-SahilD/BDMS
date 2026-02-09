import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import * as jose from "jose";

export async function GET(req) {
    try {
        await connectToDatabase();

        // Get token from cookies
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change");
        const { payload } = await jose.jwtVerify(token, secret);

        const user = await User.findById(payload.userId).select("-password");
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.log("Profile fetch error:", error);
        return NextResponse.json({ error: "Unauthorized or token expired" }, { status: 401 });
    }
}

export async function PUT(req) {
    try {
        await connectToDatabase();

        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change");
        const { payload } = await jose.jwtVerify(token, secret);

        const data = await req.json();
        const { facilityName, licenseNumber, contactPerson, phone, address } = data;

        // Construct update object - carefully only allowing specific fields
        const updateFields = {};
        if (facilityName) updateFields.facilityName = facilityName;
        if (licenseNumber) updateFields.licenseNumber = licenseNumber;
        if (contactPerson) updateFields.name = contactPerson; // Map contactPerson back to name
        if (phone) updateFields.phone = phone;
        if (phone) updateFields.phone = phone;
        if (address) {
            // Handle both string (from form) and object (if expanded later)
            updateFields.address = typeof address === 'string' ? { street: address } : address;
        }

        const updatedUser = await User.findByIdAndUpdate(
            payload.userId,
            { $set: updateFields },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
