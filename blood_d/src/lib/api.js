import { NextResponse } from "next/server";

/**
 * Standard API response helpers
 */
export const apiResponse = {
    /**
     * Success response
     * @param {Object} data - Response data
     * @param {number} status - HTTP status code (default: 200)
     */
    success: (data, status = 200) => NextResponse.json(data, { status }),

    /**
     * Error response
     * @param {string} message - Error message
     * @param {number} status - HTTP status code (default: 500)
     */
    error: (message, status = 500) => NextResponse.json({ error: message }, { status }),

    /**
     * 401 Unauthorized response
     */
    unauthorized: () => NextResponse.json({ error: "Unauthorized" }, { status: 401 }),

    /**
     * 404 Not Found response
     * @param {string} resource - Resource name (default: "Resource")
     */
    notFound: (resource = "Resource") => NextResponse.json({ error: `${resource} not found` }, { status: 404 }),

    /**
     * 400 Bad Request response
     * @param {string} message - Error message
     */
    badRequest: (message) => NextResponse.json({ error: message }, { status: 400 }),

    /**
     * 201 Created response
     * @param {Object} data - Response data
     */
    created: (data) => NextResponse.json(data, { status: 201 }),
};

/**
 * Higher-order function to wrap API handlers with error handling
 * @param {Function} handler - API handler function
 * @returns {Function} Wrapped handler with try-catch
 */
export function withErrorHandler(handler) {
    return async (req, ...args) => {
        try {
            return await handler(req, ...args);
        } catch (error) {
            // Handle auth errors specifically
            if (error.message === "UNAUTHORIZED") {
                return apiResponse.unauthorized();
            }
            console.error(`API Error:`, error);
            return apiResponse.error("Internal Server Error");
        }
    };
}
