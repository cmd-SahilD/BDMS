import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getUserFromRequest, hasRole } from "@/lib/auth";

export async function GET(req) {
    try {
        await connectToDatabase();
        const user = await getUserFromRequest(req);

        if (!hasRole(user, ["admin"])) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch all Donors
        const donors = await User.find({ role: "donor" })
            .select("-password")
            .sort({ createdAt: -1 });

        return NextResponse.json(donors);
    } catch (error) {
        console.error("Error fetching donors:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Optional: DELETE donor
export async function DELETE(req) {
    try {
        await connectToDatabase();
        const user = await getUserFromRequest(req);
        if (!hasRole(user, ["admin"])) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json({ message: "Donor deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Update donor verification
export async function PUT(req) {
    try {
        await connectToDatabase();
        const user = await getUserFromRequest(req);
        if (!hasRole(user, ["admin"])) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id, isVerified } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        const updatedDonor = await User.findByIdAndUpdate(
            id,
            { isVerified },
            { new: true }
        ).select("-password");

        return NextResponse.json(updatedDonor);
    } catch (error) {
        console.error("Error updating donor:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
