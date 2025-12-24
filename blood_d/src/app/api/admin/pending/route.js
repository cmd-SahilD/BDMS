import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
    try {
        await connectToDatabase();

        // Fetch all users that are not verified and are not admins
        const pendingUsers = await User.find({ 
            isVerified: false, 
            role: { $ne: "admin" } 
        })
        .select("-password")
        .sort({ createdAt: -1 });

        return NextResponse.json(pendingUsers);
    } catch (error) {
        console.error("Error fetching pending users:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
