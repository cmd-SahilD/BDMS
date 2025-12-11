import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Inventory from "@/models/Inventory";
import User from "@/models/User";

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const facilityId = searchParams.get("facilityId");

        let query = {};
        if (facilityId) {
            query.facilityId = facilityId;
        }

        const inventory = await Inventory.find(query).populate("facilityId", "name facilityName");
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
