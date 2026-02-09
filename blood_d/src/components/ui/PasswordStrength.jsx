"use client";
import { useMemo } from "react";

/**
 * Password strength indicator component
 * Shows visual feedback on password strength
 */
export default function PasswordStrength({ password }) {
    const strength = useMemo(() => {
        if (!password) return { score: 0, label: '', color: 'bg-gray-200' };

        let score = 0;

        // Length checks
        if (password.length >= 6) score += 1;
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;

        // Character variety
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^a-zA-Z0-9]/.test(password)) score += 1;

        // Cap at 5 for display
        score = Math.min(score, 5);

        const levels = [
            { label: 'Very Weak', color: 'bg-red-500' },
            { label: 'Weak', color: 'bg-orange-500' },
            { label: 'Fair', color: 'bg-yellow-500' },
            { label: 'Good', color: 'bg-lime-500' },
            { label: 'Strong', color: 'bg-green-500' },
            { label: 'Very Strong', color: 'bg-emerald-500' }
        ];

        return { score, ...levels[score] };
    }, [password]);

    if (!password) return null;

    return (
        <div className="mt-2">
            <div className="flex gap-1 mb-1">
                {[0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all ${i < strength.score ? strength.color : 'bg-gray-200'
                            }`}
                    />
                ))}
            </div>
            <p className={`text-xs font-medium ${strength.score < 2 ? 'text-red-600' :
                    strength.score < 4 ? 'text-yellow-600' :
                        'text-green-600'
                }`}>
                {strength.label}
            </p>
        </div>
    );
}
