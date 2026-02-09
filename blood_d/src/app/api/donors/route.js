import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

import { getUserFromRequest } from "@/lib/auth";
import Donation from "@/models/Donation";

export async function GET(req) {
    try {
        await connectToDatabase();
        const user = await getUserFromRequest(req);

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let query = { role: "donor" };

        // Users with these roles can see all donors
        if (["hospital", "blood-bank", "admin"].includes(user.role)) {
            // No filter needed, they see all donors
        }
        // If we needed to restrict others, we would add else block here

        const donors = await User.find(query)
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
