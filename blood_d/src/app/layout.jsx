import "./globals.css";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

export const metadata = {
  title: "Blood Donation System",
  description: "A comprehensive management system for blood donation and bank operations.",
  icons: {
    icon: "/icon.png",
  },
};

export default async function RootLayout({ children }) {
  // #region agent log
  try {
    const hdrs = await headers();
    const host = hdrs.get("host");
    const renderPath = hdrs.get("x-invoke-path") || hdrs.get("x-pathname") || hdrs.get("referer");
    // Removed self-referential fetch to avoid deadlock


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
