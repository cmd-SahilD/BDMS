import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import fs from "fs";
import path from "path";

export async function middleware(request) {
    // Get the path from the request URL
    const path = request.nextUrl.pathname;

    // #region agent log
    const logPayloadEntry = {
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'H1',
        location: 'middleware.js:entry',
        message: 'Incoming request path',
        data: { path, method: request.method, hasToken: !!request.cookies.get("token") },
        timestamp: Date.now()
    };
    fetch(new URL('/api/__agent_log', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logPayloadEntry)
    }).catch(() => { });
    try {
        const logPath = path.join(process.cwd(), ".cursor", "debug.log");
        fs.mkdirSync(path.dirname(logPath), { recursive: true });
        fs.appendFileSync(logPath, JSON.stringify({ ...logPayloadEntry, message: 'Incoming request path (fs)' }) + "\n");
    } catch (err) {
        // swallow logging errors
    }
    // #endregion

    // Define public paths that don't need authentication
    const publicPaths = ["/login", "/register", "/", "/api/login", "/api/register"];

    // If the path is public, verify if we should redirect (e.g. logged in user visiting login)
    // or just allow access.
    if (publicPaths.includes(path)) {
        // #region agent log
        fetch(new URL('/api/__agent_log', request.url), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'H2',
                location: 'middleware.js:public',
                message: 'Public path passthrough',
                data: { path },
                timestamp: Date.now()
            })
        }).catch(() => { });
        // #endregion
        return NextResponse.next();
    }

    // Check for protected routes (e.g. starting with /lab or /admin)
    // You can adjust this logic based on your exact route structure
    if (path.startsWith("/lab") || path.startsWith("/admin")) {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            // #region agent log
            fetch(new URL('/api/__agent_log', request.url), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: 'debug-session',
                    runId: 'run1',
                    hypothesisId: 'H3',
                    location: 'middleware.js:no-token',
                    message: 'Protected route missing token',
                    data: { path },
                    timestamp: Date.now()
                })
            }).catch(() => { });
            // #endregion
            // Redirect to login if no token found
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change");
            await jwtVerify(token, secret);
            // #region agent log
            fetch(new URL('/api/__agent_log', request.url), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: 'debug-session',
                    runId: 'run1',
                    hypothesisId: 'H3',
                    location: 'middleware.js:token-valid',
                    message: 'Protected route token valid',
                    data: { path },
                    timestamp: Date.now()
                })
            }).catch(() => { });
            // #endregion
            // Token is valid
            return NextResponse.next();
        } catch (error) {
            console.error("Middleware auth error:", error);
            // #region agent log
            fetch(new URL('/api/__agent_log', request.url), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: 'debug-session',
                    runId: 'run1',
                    hypothesisId: 'H3',
                    location: 'middleware.js:token-invalid',
                    message: 'Protected route token invalid',
                    data: { path, error: String(error?.message || error) },
                    timestamp: Date.now()
                })
            }).catch(() => { });
            // #endregion
            // Token invalid or expired
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
