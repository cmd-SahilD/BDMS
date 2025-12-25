import { jwtVerify, SignJWT } from "jose";

/**
 * Get the JWT secret encoded for jose library
 */
export const getJwtSecret = () => 
    new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change");

/**
 * Extract and verify user from request cookies
 * @param {Request} request - The incoming request object
 * @returns {Promise<Object|null>} User payload or null if invalid/missing
 */
export async function getUserFromRequest(request) {
    const token = request.cookies.get("token")?.value;
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, getJwtSecret());
        return payload;
    } catch {
        return null;
    }
}

/**
 * Create a signed JWT token
 * @param {Object} payload - Token payload (userId, email, role)
 * @returns {Promise<string>} Signed JWT token
 */
export async function createToken(payload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(getJwtSecret());
}

/**
 * Set authentication cookie on response
 * @param {Response} response - NextResponse object
 * @param {string} token - JWT token to set
 */
export function setAuthCookie(response, token) {
    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
    });
}

/**
 * Require authentication - returns user or throws auth error
 * @param {Request} request - The incoming request object
 * @returns {Promise<Object>} User payload
 * @throws {Error} If not authenticated
 */
export async function requireAuth(request) {
    const user = await getUserFromRequest(request);
    if (!user) {
        throw new Error("UNAUTHORIZED");
    }
    return user;
}

/**
 * Check if user has one of the allowed roles
 * @param {Object} user - User payload
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {boolean}
 */
export function hasRole(user, allowedRoles) {
    return allowedRoles.includes(user?.role);
}
