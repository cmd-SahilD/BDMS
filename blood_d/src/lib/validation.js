import mongoose from "mongoose";

/**
 * Validate if a string is a valid MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean}
 */
export function isValidObjectId(id) {
    if (!id) return false;
    return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean}
 */
export function isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Sanitize input to prevent XSS
 * @param {string} input - The input to sanitize
 * @returns {string}
 */
export function sanitizeInput(input) {
    if (!input || typeof input !== 'string') return '';
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Validate password strength (strict)
 * @param {string} password - The password to check
 * @returns {{ isValid: boolean, error: string|null }}
 */
export function validatePassword(password) {
    if (!password) {
        return { isValid: false, error: 'Password is required' };
    }

    if (password.length < 8) {
        return { isValid: false, error: 'Password must be at least 8 characters long' };
    }

    if (!/[A-Z]/.test(password)) {
        return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }

    if (!/[a-z]/.test(password)) {
        return { isValid: false, error: 'Password must contain at least one lowercase letter' };
    }

    if (!/[0-9]/.test(password)) {
        return { isValid: false, error: 'Password must contain at least one number' };
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
        return { isValid: false, error: 'Password must contain at least one special character' };
    }

    return { isValid: true, error: null };
}

/**
 * Check password strength score (for UI feedback)
 * @param {string} password - The password to check
 * @returns {{ score: number, feedback: string[] }}
 */
export function checkPasswordStrength(password) {
    const feedback = [];
    let score = 0;

    if (!password) return { score: 0, feedback: ['Password is required'] };

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    // Normalize to 0-5 scale roughly
    return {
        score: Math.min(score, 5),
        feedback
    };
}

/**
 * Validate blood type
 * @param {string} bloodType - The blood type to validate
 * @returns {boolean}
 */
export function isValidBloodType(bloodType) {
    const validTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    return validTypes.includes(bloodType);
}

/**
 * Validate phone number (basic)
 * @param {string} phone - The phone number to validate
 * @returns {boolean}
 */
export function isValidPhone(phone) {
    if (!phone) return false;
    // Allow digits, spaces, dashes, parentheses, and + for country code
    const phoneRegex = /^[\d\s\-\(\)\+]{8,20}$/;
    return phoneRegex.test(phone);
}

/**
 * Validate age (Donor must be <= 60)
 * @param {number} age - The age to validate
 * @returns {boolean}
 */
export function isValidAge(age) {
    if (!age) return false;
    return age <= 60;
}
