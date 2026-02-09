import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Donation from "@/models/Donation";
import User from "@/models/User";
import { getUserFromRequest, hasRole } from "@/lib/auth";

export async function GET(request) {
    try {
        await connectToDatabase();
        const user = await getUserFromRequest(request);

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const donorId = searchParams.get("donorId");

        let query = {};

        if (user.role === "donor") {
            // Donors can only see their own history
            query.donorId = user.userId;
        } else if (user.role === "hospital" || user.role === "blood-bank") {
            // Facilities can only see donations recorded by them
            query.facilityId = user.userId;

            // If they want to filter by specific donor within their records
            if (donorId) {
                query.donorId = donorId;
            }
        } else if (donorId) {
            // Admins can see specific donor history
            query.donorId = donorId;
        }

        // Admins see all if no donorId provided

        const donations = await Donation.find(query)
            .sort({ date: -1 })
            .populate("donorId", "name bloodType")
            .populate("facilityId", "name");

        return NextResponse.json({ donations }, { status: 200 });
    } catch (error) {
        console.error("Error fetching donations:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

import Inventory from "@/models/Inventory";

export async function POST(request) {
    try {
        await connectToDatabase();
        const user = await getUserFromRequest(request);

        // Only admin, hospital, blood-bank, or lab can create donation records
        if (!user || !hasRole(user, ["admin", "hospital", "blood-bank", "lab"])) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();
        const { donorId, date, type, units, location, status } = data;

        if (!donorId || !type || !location) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const donation = await Donation.create({
            donorId,
            facilityId: user.userId,
            date: date || new Date(),
            type,
            units: units || 1,
            location,
            status: status || "Completed",
        });

        // Update donor's last donation date
        await User.findByIdAndUpdate(donorId, { lastDonationDate: donation.date });

        // Sync with Inventory if status is Completed
        if (donation.status === "Completed") {
            await Inventory.findOneAndUpdate(
                { facilityId: user.userId, bloodType: type },
                { $inc: { units: units || 1 } },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        return NextResponse.json({ message: "Donation recorded successfully", donation }, { status: 201 });
    } catch (error) {
        console.error("Error creating donation:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
