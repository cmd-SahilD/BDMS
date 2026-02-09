import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { rateLimit } from "@/lib/rateLimit";
import { sanitizeInput, validatePassword } from "@/lib/validation";

export async function POST(req) {
  try {
    // Rate limiting: 3 registrations per hour per IP (stricter)
    const limiterResults = rateLimit(req, 3, 60 * 60 * 1000);
    if (limiterResults) return limiterResults;

    await connectToDatabase();

    const data = await req.json();
    const name = sanitizeInput(data.name);
    const email = sanitizeInput(data.email);
    const password = data.password; // Passwords shouldn't be HTML sanitized as they are hashed, but we'll stick to basic safety
    const phone = sanitizeInput(data.phone);
    const address = data.address; // Nested object
    const role = data.role;
    const bloodType = data.bloodType;
    const facilityName = sanitizeInput(data.facilityName);
    const licenseNumber = sanitizeInput(data.licenseNumber);
    const weight = data.weight;
    const age = data.age;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Age validation for donors
    if (role === 'donor' && age && age > 60) {
      return NextResponse.json({ error: "Donor age cannot exceed 60 years" }, { status: 400 });
    }

    // Password validation
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      return NextResponse.json({ error: passwordCheck.error }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "donor",
      bloodType,
      phone,
      address,
      facilityName,
      licenseNumber,
      weight: role === 'donor' ? weight : undefined,
      age: role === 'donor' ? age : undefined,
      isVerified: false, // Donors now require admin verification too
    });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
