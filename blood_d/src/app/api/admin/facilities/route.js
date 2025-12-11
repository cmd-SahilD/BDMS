import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

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
