import { NextResponse } from "next/server";

const ipRequests = new Map();

/**
 * Basic in-memory rate limiter
 * @param {Request} request 
 * @param {number} limit - Max requests
 * @param {number} windowMs - Time window in ms
 * @returns {NextResponse|null} - Returns error response if limited, null otherwise
 */
export function rateLimit(request, limit = 5, windowMs = 60 * 1000) {
    // In a real app with multiple instances, use Redis
    // For this single-instance app, Map is fine

    // Get IP (this is tricky in Next.js edge/serverless, often passed in headers)
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Cleanup old records
    const now = Date.now();
    for (const [key, data] of ipRequests.entries()) {
        if (now - data.startTime > windowMs) {
            ipRequests.delete(key);
        }
    }

    const record = ipRequests.get(ip) || { count: 0, startTime: now };

    // Reset if window passed
    if (now - record.startTime > windowMs) {
        record.count = 0;
        record.startTime = now;
    }

    record.count++;
    ipRequests.set(ip, record);

    if (record.count > limit) {
        return NextResponse.json(
            { error: "Too many requests, please try again later." },
            { status: 429 }
        );
    }

    return null;
}
