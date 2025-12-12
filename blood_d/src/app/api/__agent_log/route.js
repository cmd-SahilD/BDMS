import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOG_PATH = path.join(process.cwd(), ".cursor", "debug.log");

export async function POST(req) {
    try {
        const payload = await req.json();
        fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
        fs.appendFileSync(LOG_PATH, JSON.stringify(payload) + "\n");
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ error: "log-failed", detail: String(error) }, { status: 500 });
    }
}


