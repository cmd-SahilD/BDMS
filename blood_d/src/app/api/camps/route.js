import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Camp from "@/models/Camp";

import { getUserFromRequest } from "@/lib/auth";
import { logActivity } from "@/lib/logger";

export async function GET(req) {
    try {
        await connectToDatabase();
        const user = await getUserFromRequest(req);

        let query = {};
        if (user) {
            if (user.role === "hospital" || user.role === "blood-bank") {
                // Facility can only see their own camps
                query.organizerId = user.userId;
            }
            // Admins see all
        }

        const camps = await Camp.find(query).sort({ date: 1 });

        // Auto-update status logic
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const refinedCamps = await Promise.all(camps.map(async (camp) => {
            const campDate = new Date(camp.date);

            // Normalize camp date to start of day for comparison
            const campStartOfDay = new Date(campDate.getFullYear(), campDate.getMonth(), campDate.getDate());

            if (campStartOfDay < startOfToday) {
                // Past date -> Completed
                if (camp.status !== 'Completed') {
                    camp.status = 'Completed';
                    await camp.save();
                }
            } else if (campStartOfDay.getTime() === startOfToday.getTime()) {
                // Today -> Check time
                try {
                    const [startH, startM] = camp.startTime.split(':').map(Number);
                    const [endH, endM] = camp.endTime.split(':').map(Number);

                    const campStart = new Date(now);
                    campStart.setHours(startH, startM, 0);

                    const campEnd = new Date(now);
                    campEnd.setHours(endH, endM, 0);

                    if (now >= campStart && now <= campEnd) {
                        if (camp.status !== 'Ongoing') {
                            camp.status = 'Ongoing';
                            await camp.save();
                        }
                    } else if (now > campEnd) {
                        if (camp.status !== 'Completed') {
                            camp.status = 'Completed';
                            await camp.save();
                        }
                    }
                    // Else: it is before start time, keep as 'Upcoming'
                } catch (e) {
                    console.error("Error parsing camp time:", e);
                }
            }
            return camp;
        }));

        return NextResponse.json(refinedCamps, { status: 200 });
    } catch (error) {
        console.error("Fetch camps error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const { organizerId, name, date, startTime, endTime, location, expectedDonors, description } = await req.json();

        const newCamp = new Camp({
            organizerId,
            name,
            date,
            startTime,
            endTime,
            location,
            expectedDonors,
            description,
            status: "Upcoming"
        });

        await newCamp.save();

        // Log activity
        await logActivity(organizerId, "Camp Scheduled", `Scheduled camp "${name}" on ${date}`, "blue");

        return NextResponse.json({ message: "Camp created successfully", camp: newCamp }, { status: 201 });
    } catch (error) {
        console.error("Create camp error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectToDatabase();
        const { id, name, date, startTime, endTime, location, expectedDonors, description, status } = await req.json();

        const updatedCamp = await Camp.findByIdAndUpdate(
            id,
            { name, date, startTime, endTime, location, expectedDonors, description, status },
            { new: true }
        );

        if (!updatedCamp) {
            return NextResponse.json({ error: "Camp not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Camp updated successfully", camp: updatedCamp }, { status: 200 });
    } catch (error) {
        console.error("Update camp error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        // Option 1: Hard delete
        const deletedCamp = await Camp.findByIdAndDelete(id);

        // Option 2: Soft delete / Cancel
        // const deletedCamp = await Camp.findByIdAndUpdate(id, { status: 'Cancelled' }, { new: true });

        if (!deletedCamp) {
            return NextResponse.json({ error: "Camp not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Camp deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Delete camp error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
