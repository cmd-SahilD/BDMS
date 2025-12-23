import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function PATCH(req, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;
        const updates = await req.json();

        // Prevent updating sensitive fields if necessary
        const allowedUpdates = ["name", "email", "phone", "address", "bloodType", "weight", "age"];
        const filteredUpdates = Object.keys(updates)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
                obj[key] = updates[key];
                return obj;
            }, {});

        const user = await User.findByIdAndUpdate(id, filteredUpdates, { new: true }).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Update user error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
