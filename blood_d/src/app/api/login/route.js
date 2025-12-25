import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { createToken, setAuthCookie } from "@/lib/auth";

export async function POST(req) {
    try {
        await connectToDatabase();

        const { email, password } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Generate JWT using centralized auth utility
        const token = await createToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        });

        const response = NextResponse.json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                bloodType: user.bloodType,
                weight: user.weight,
                age: user.age,
                phone: user.phone,
                address: user.address,
                facilityName: user.facilityName,
                licenseNumber: user.licenseNumber,
            }
        }, { status: 200 });

        // Set HTTP-only cookie using centralized auth utility
        setAuthCookie(response, token);

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
