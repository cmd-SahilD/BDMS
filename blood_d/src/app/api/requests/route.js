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

        return NextResponse.json({ message: "Request updated successfully", request: updatedRequest }, { status: 200 });
    } catch (error) {
        console.error("Update request error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
