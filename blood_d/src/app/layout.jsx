import "./globals.css";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

export default async function RootLayout({ children }) {
  // #region agent log
  try {
    const hdrs = headers();
    const host = hdrs.get("host");
    const renderPath = hdrs.get("x-invoke-path") || hdrs.get("x-pathname") || hdrs.get("referer");
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/__agent_log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H7",
        location: "layout.jsx:render",
        message: "Root layout render",
        data: { host, path: renderPath },
        timestamp: Date.now()
      })
    });

    // also append directly to disk to guarantee capture even if fetch fails
    const logPath = path.join(process.cwd(), ".cursor", "debug.log");
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, JSON.stringify({
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "H7",
      location: "layout.jsx:render",
      message: "Root layout render (fs)",
      data: { host, path: renderPath },
      timestamp: Date.now()
    }) + "\n");
  } catch (err) {
    // swallow logging errors in layout
  }
  // #endregion

  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  );
}
