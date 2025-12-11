import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Camp from "@/models/Camp";

export async function GET(req) {
    try {
        await connectToDatabase();

        // Can add filtering here based on query params if needed
        const camps = await Camp.find().sort({ date: 1 });

        return NextResponse.json(camps, { status: 200 });
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
