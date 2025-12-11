import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
    try {
        await connectToDatabase();

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
