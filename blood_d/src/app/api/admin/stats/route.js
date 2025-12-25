import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Inventory from "@/models/Inventory";
import Camp from "@/models/Camp";

export async function GET() {
    try {
        await connectToDatabase();

        // 1. Count Donors
        const totalDonors = await User.countDocuments({ role: "donor" });

        // 2. Count Facilities (Hospitals + Labs + Blood Banks)
        const totalFacilities = await User.countDocuments({ 
            role: { $in: ["hospital", "blood-bank", "lab"] } 
        });

        // 3. Total Blood Units (Sum of all units in Inventory)
        const inventoryStats = await Inventory.aggregate([
            {
                $group: {
                    _id: null,
                    totalUnits: { $sum: "$units" }
                }
            }
        ]);
        const totalDonations = inventoryStats[0]?.totalUnits || 0;

        // 4. Count Upcoming Camps
        const totalCamps = await Camp.countDocuments({ status: "Upcoming" });

        return NextResponse.json({
            donors: totalDonors,
            facilities: totalFacilities,
            donations: totalDonations,
            camps: totalCamps
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
