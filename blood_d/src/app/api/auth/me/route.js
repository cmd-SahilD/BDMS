import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;
        // console.log("Debug Auth: Token present?", !!token); // Debug log

        if (!token) {
            console.log("Debug Auth: No token found in cookies");
            return NextResponse.json({ error: "Missing Token" }, { status: 401 });
        }

        try {
            const { payload } = await jwtVerify(
                token,
                new TextEncoder().encode("temporary_debug_secret_key_999")
            );
            // console.log("Debug Auth: Token verified for user", payload.userId);

            await connectToDatabase();
            const user = await User.findById(payload.userId).select("-password");

            if (!user) {
                console.log("Debug Auth: User not found in DB");
                return NextResponse.json({ error: "User Not Found in DB" }, { status: 404 });
            }

            return NextResponse.json(user);
        } catch (verifyError) {
            console.error("Debug Auth: Verification failed:", verifyError.message);
            // console.log("Token sample:", token.substring(0, 10) + "...");
            return NextResponse.json({ error: "Token Verification Failed: " + verifyError.message }, { status: 401 });
        }

    } catch (error) {
        console.error("Auth me error wrapper:", error);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
