import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Donation from "@/models/Donation";
import User from "@/models/User";
import { jwtVerify } from "jose";

// Helper to get user from token
async function getUserFromRequest(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change");
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

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
    } else if (donorId) {
      // Admins/Hospitals/Blood Banks can see specific donor history
      query.donorId = donorId;
    } else {
      // Fetch all if authorized (admin/blood-bank) - limit to recent for now
      // Or if no donorId specified for blood-bank, maybe just return empty or all?
      // Let's return all for now, sorted by date
    }

    const donations = await Donation.find(query).sort({ date: -1 }).populate("donorId", "name bloodType").populate("facilityId", "name");

    return NextResponse.json({ donations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const user = await getUserFromRequest(request);

    if (!user || user.role === "donor") { // Donors shouldn't self-report usually, but for dev maybe? keeping it strict for now
        // Actually, let's allow blood banks/hospitals to add records.
        if (user.role !== "admin" && user.role !== "hospital" && user.role !== "blood-bank" && user.role !== "lab") { // 'lab' for legacy support
             return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    }

    const data = await request.json();
    const { donorId, date, type, units, location, status } = data;

    if (!donorId || !type || !location) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const donation = await Donation.create({
      donorId,
      facilityId: user.userId, // The one creating the record
      date: date || new Date(),
      type,
      units: units || 1,
      location,
      status: status || "Completed",
    });

    // Update donor's last donation date
    await User.findByIdAndUpdate(donorId, { lastDonationDate: donation.date });

    return NextResponse.json({ message: "Donation recorded successfully", donation }, { status: 201 });
  } catch (error) {
    console.error("Error creating donation:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
