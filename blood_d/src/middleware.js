import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
    // Get the path from the request URL
    const path = request.nextUrl.pathname;

    // Define public paths that don't need authentication
    const publicPaths = ["/login", "/register", "/", "/api/login", "/api/register"];

    // If the path is public, verify if we should redirect (e.g. logged in user visiting login)
    // or just allow access.
    if (publicPaths.includes(path)) {
        return NextResponse.next();
    }

    // Check for protected routes (e.g. starting with /lab or /admin)
    // You can adjust this logic based on your exact route structure
    if (path.startsWith("/lab") || path.startsWith("/admin")) {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            // Redirect to login if no token found
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change");
            await jwtVerify(token, secret);
            // Token is valid
            return NextResponse.next();
        } catch (error) {
            console.error("Middleware auth error:", error);
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
