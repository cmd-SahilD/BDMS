import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();

        const donors = await User.find({ role: "donor" })
            .select("-password") // Exclude password
            .sort({ createdAt: -1 }); // Newest first

        return NextResponse.json({ donors });
    } catch (error) {
        console.error("Error fetching donors:", error);
        return NextResponse.json(
            { error: "Failed to fetch donors" },
            { status: 500 }
        );
    }
}
