import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Inventory from "@/models/Inventory";
import Camp from "@/models/Camp";
import Request from "@/models/Request";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        await connectToDatabase();

        // #region agent log
        const logPayload = {
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'H5',
            location: 'api/admin/stats:entry',
            message: 'Admin stats requested',
            data: {},
            timestamp: Date.now()
        };
        fetch(new URL('/api/__agent_log', 'http://localhost'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logPayload)
        }).catch(() => { });
        try {
            const logPath = path.join(process.cwd(), ".cursor", "debug.log");
            fs.mkdirSync(path.dirname(logPath), { recursive: true });
            fs.appendFileSync(logPath, JSON.stringify({ ...logPayload, message: 'Admin stats requested (fs)' }) + "\n");
        } catch (err) {
            // swallow logging errors
        }
        // #endregion

        // 1. Count Donors
        const totalDonors = await User.countDocuments({ role: "donor" });

        // 2. Count Facilities (Hospitals + Labs)
        const totalFacilities = await User.countDocuments({ role: { $in: ["hospital", "lab"] } });

        // 3. Total Blood Units (Sum of all units in Inventory)
        // using aggregate to sum
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
