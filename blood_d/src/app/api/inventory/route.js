import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Inventory from "@/models/Inventory";
import User from "@/models/User";

import { getUserFromRequest } from "@/lib/auth";
import { logActivity } from "@/lib/logger";

export async function GET(req) {
    try {
        await connectToDatabase();
        const user = await getUserFromRequest(req);
        const { searchParams } = new URL(req.url);
        const facilityIdParam = searchParams.get("facilityId");
        const includeBloodBanks = searchParams.get("includeBloodBanks") === "true";

        let query = {};

        if (user) {
            if (user.role === "hospital" || user.role === "blood-bank") {
                // Facility sees only their own inventory
                query.facilityId = user.userId;
            } else if (facilityIdParam) {
                // Admin or others filtering by param
                query.facilityId = facilityIdParam;
            }
        } else {
            // If no user (e.g. public page?), maybe limit or require auth. 
            // Assuming existing logic allowed public access via param if intended, 
            // but strictly for dashboard, we want isolation.
            // If we want to allow public access to inventory, we should check logic.
            // But for safety, let's respect the param if provided for public, 
            // but if this is an internal API, we should require auth.
            // The prompt implies "fixing isolation", so prioritizing auth user isolation.
            if (facilityIdParam) {
                query.facilityId = facilityIdParam;
            }
        }

        const inventory = await Inventory.find(query).populate("facilityId", "name facilityName role");

        // If requesting blood bank inventory as well
        if (includeBloodBanks) {
            // Find all verified blood banks
            const bloodBanks = await User.find({
                role: "blood-bank",
                isVerified: true
            }).select("_id");

            const bloodBankIds = bloodBanks.map(bb => bb._id);

            // Get inventory from all blood banks
            const bloodBankInventory = await Inventory.find({
                facilityId: { $in: bloodBankIds }
            }).populate("facilityId", "name facilityName role");

            // Aggregate by blood type
            const aggregated = {};
            bloodBankInventory.forEach(item => {
                if (!aggregated[item.bloodType]) {
                    aggregated[item.bloodType] = {
                        bloodType: item.bloodType,
                        totalUnits: 0,
                        sources: []
                    };
                }
                aggregated[item.bloodType].totalUnits += item.units;
                aggregated[item.bloodType].sources.push({
                    facilityId: item.facilityId._id,
                    facilityName: item.facilityId.facilityName || item.facilityId.name,
                    units: item.units
                });
            });

            const bloodBankStock = Object.values(aggregated);

            return NextResponse.json({
                hospitalInventory: inventory,
                bloodBankInventory: bloodBankStock
            }, { status: 200 });
        }

        return NextResponse.json(inventory, { status: 200 });
    } catch (error) {
        console.error("Fetch inventory error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const { facilityId, bloodType, units, expiryDate, status } = await req.json();

        const newItem = new Inventory({
            facilityId,
            bloodType,
            units,
            expiryDate,
            status
        });

        await newItem.save();

        // Log activity
        await logActivity(facilityId, "Stock Update", `Added ${units} units of ${bloodType}`, "green");

        return NextResponse.json({ message: "Stock added successfully", item: newItem }, { status: 201 });
    } catch (error) {
        console.error("Add inventory error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectToDatabase();
        const { id, units, status } = await req.json();

        const updatedItem = await Inventory.findByIdAndUpdate(
            id,
            { units, status },
            { new: true }
        );

        if (!updatedItem) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        // Log activity
        await logActivity(updatedItem.facilityId, "Stock Update", `Updated inventory units`, "green");

        return NextResponse.json({ message: "Stock updated successfully", item: updatedItem }, { status: 200 });
    } catch (error) {
        console.error("Update inventory error:", error);
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

        const deletedItem = await Inventory.findByIdAndDelete(id);

        if (!deletedItem) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Stock removed successfully" }, { status: 200 });
    } catch (error) {
        console.error("Delete inventory error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
