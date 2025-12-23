import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectToDatabase();

        const { facilityName, email, password, role, phone, licenseNumber, address } = await req.json();

        // Validate role is either hospital or lab
        if (!["hospital", "lab"].includes(role)) {
            return NextResponse.json({ error: "Invalid role. Must be hospital or lab." }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newFacility = new User({
            facilityName,
            name: facilityName, // For consistency
            email,
            password: hashedPassword,
            role,
            phone,
            licenseNumber,
            address,
            isVerified: true // Admin created facilities are verified by default
        });

        await newFacility.save();

        const response = newFacility.toObject();
        delete response.password;

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error("Facility creation error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await connectToDatabase();

        // Fetch all Hospitals and Labs
        const facilities = await User.find({ role: { $in: ["hospital", "lab"] } })
            .select("-password") // Exclude password
            .sort({ createdAt: -1 });

        return NextResponse.json(facilities);
    } catch (error) {
        console.error("Error fetching facilities:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectToDatabase();

        // Expect body: { id: "...", isVerified: true/false }
        const { id, isVerified } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Facility ID is required" }, { status: 400 });
        }

        const updatedFacility = await User.findByIdAndUpdate(
            id,
            { isVerified: isVerified },
            { new: true }
        ).select("-password");

        if (!updatedFacility) {
            return NextResponse.json({ error: "Facility not found" }, { status: 404 });
        }

        return NextResponse.json(updatedFacility);

    } catch (error) {
        console.error("Error updating facility:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
