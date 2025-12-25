"use client";
import { useCallback } from "react";

/**
 * Custom hook for authentication actions
 * Provides logout functionality
 */
export function useAuth() {
    const logout = useCallback(() => {
        // Clear the auth cookie
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        // Redirect to login
        window.location.href = "/login";
    }, []);

    return { logout };
}
