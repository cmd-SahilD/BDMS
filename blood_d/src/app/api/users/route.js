import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role");

        let query = {};
        if (role) {
            if (role === 'blood-bank') {
                query.role = { $in: ['blood-bank', 'lab'] };
            } else {
                query.role = role;
            }
        }

        // Fetch users, excluding sensitive data like password
        const users = await User.find(query).select("-password").sort({ name: 1 });

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Fetch users error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
