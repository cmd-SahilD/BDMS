import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();

    // #region agent log
    const logPayload = {
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'H4',
      location: 'api/login:entry',
      message: 'Login attempt',
      data: { email },
      timestamp: Date.now()
    };
    fetch(new URL('/api/__agent_log', req.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logPayload)
    }).catch(() => { });
    try {
      const logPath = path.join(process.cwd(), ".cursor", "debug.log");
      fs.mkdirSync(path.dirname(logPath), { recursive: true });
      fs.appendFileSync(logPath, JSON.stringify({ ...logPayload, message: 'Login attempt (fs)' }) + "\n");
    } catch (err) {
      // swallow logging errors
    }
    // #endregion

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change");
    const token = await new jose.SignJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bloodType: user.bloodType,
      }
    }, { status: 200 });

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
