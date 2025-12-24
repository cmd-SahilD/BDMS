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
