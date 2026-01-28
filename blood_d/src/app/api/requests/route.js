import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Request from "@/models/Request";
import User from "@/models/User";

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const requesterId = searchParams.get("requesterId");
        const providerId = searchParams.get("providerId");

        let query = {};
        if (requesterId) query.requesterId = requesterId;
        if (providerId) query.providerId = providerId;

        const requests = await Request.find(query)
            .populate("requesterId", "name facilityName address")
            .populate("providerId", "name facilityName address")
            .sort({ createdAt: -1 });

        return NextResponse.json(requests, { status: 200 });
    } catch (error) {
        console.error("Fetch requests error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const { requesterId, providerId, bloodType, units, notes } = await req.json();

        const newRequest = new Request({
            requesterId,
            providerId,
            bloodType,
            units,
            notes,
            status: "Pending"
        });

        await newRequest.save();
        return NextResponse.json({ message: "Request created successfully", request: newRequest }, { status: 201 });
    } catch (error) {
        console.error("Create request error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectToDatabase();
        const { id, status, processedDate } = await req.json();

        // If accepting a request, we need to deduct from inventory
        if (status === 'Accepted') {
            // First, get the request details to know what to deduct
            const requestToAccept = await Request.findById(id);

            if (!requestToAccept) {
                return NextResponse.json({ error: "Request not found" }, { status: 404 });
            }

            const { providerId, bloodType, units } = requestToAccept;

            // Find inventory for this blood bank and blood type
            const Inventory = (await import("@/models/Inventory")).default;
            const inventoryItems = await Inventory.find({
                facilityId: providerId,
                bloodType: bloodType
            });

            if (inventoryItems.length === 0) {
                return NextResponse.json({
                    error: `No inventory found for blood type ${bloodType}`
                }, { status: 400 });
            }

            // Calculate total available units
            const totalAvailableUnits = inventoryItems.reduce((sum, item) => sum + item.units, 0);

            if (totalAvailableUnits < units) {
                return NextResponse.json({
                    error: `Insufficient inventory. Required: ${units} units, Available: ${totalAvailableUnits} units of ${bloodType}`
                }, { status: 400 });
            }

            // Deduct units from inventory (deduct from first item with enough units, or across multiple)
            let unitsToDeduct = units;
            for (const item of inventoryItems) {
                if (unitsToDeduct <= 0) break;

                const deductFromThis = Math.min(item.units, unitsToDeduct);
                item.units -= deductFromThis;
                unitsToDeduct -= deductFromThis;

                // Update status based on remaining units
                if (item.units === 0) {
                    item.status = 'Critical';
                } else if (item.units < 5) {
                    item.status = 'Critical';
                } else if (item.units < 10) {
                    item.status = 'Low';
                } else {
                    item.status = 'Adequate';
                }

                await item.save();
            }
        }

        // Update the request status
        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            {
                status,
                processedDate: processedDate || (status === 'Accepted' || status === 'Rejected' ? new Date() : undefined)
            },
            { new: true }
        );

        if (!updatedRequest) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: status === 'Accepted'
                ? "Request accepted and inventory updated successfully"
                : "Request updated successfully",
            request: updatedRequest
        }, { status: 200 });
    } catch (error) {
        console.error("Update request error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
