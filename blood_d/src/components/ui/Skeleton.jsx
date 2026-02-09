"use client";

/**
 * Reusable skeleton loader component
 * @param {Object} props
 * @param {string} props.variant - Type of skeleton: 'text', 'card', 'avatar', 'button'
 * @param {string} props.className - Additional classes
 * @param {number} props.lines - For text variant, number of lines
 */
export default function Skeleton({ variant = "text", className = "", lines = 1 }) {
    const baseClass = "animate-pulse bg-gray-200 rounded";

    switch (variant) {
        case "avatar":
            return (
                <div className={`${baseClass} w-12 h-12 rounded-full ${className}`} />
            );

        case "card":
            return (
                <div className={`${baseClass} p-6 space-y-4 ${className}`}>
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                    <div className="h-3 bg-gray-300 rounded w-1/2" />
                    <div className="h-3 bg-gray-300 rounded w-5/6" />
                </div>
            );

        case "button":
            return (
                <div className={`${baseClass} h-10 w-24 ${className}`} />
            );

        case "table-row":
            return (
                <div className={`flex gap-4 p-4 ${className}`}>
                    <div className={`${baseClass} h-4 flex-1`} />
                    <div className={`${baseClass} h-4 w-24`} />
                    <div className={`${baseClass} h-4 w-20`} />
                    <div className={`${baseClass} h-4 w-16`} />
                </div>
            );

        case "stat":
            return (
                <div className={`${baseClass} p-6 ${className}`}>
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-300 rounded w-20" />
                            <div className="h-8 bg-gray-300 rounded w-16" />
                        </div>
                        <div className="w-10 h-10 bg-gray-300 rounded-xl" />
                    </div>
                </div>
            );

        case "text":
        default:
            return (
                <div className={`space-y-2 ${className}`}>
                    {Array.from({ length: lines }).map((_, i) => (
                        <div
                            key={i}
                            className={`${baseClass} h-4`}
                            style={{ width: `${Math.random() * 40 + 60}%` }}
                        />
                    ))}
                </div>
            );
    }
}

/**
 * Table skeleton with configurable rows
 */
export function TableSkeleton({ rows = 5, cols = 4 }) {
    return (
        <div className="animate-pulse">
            {/* Header */}
            <div className="flex gap-4 p-4 border-b">
                {Array.from({ length: cols }).map((_, i) => (
                    <div key={i} className="h-4 bg-gray-300 rounded flex-1" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border-b">
                    {Array.from({ length: cols }).map((_, j) => (
                        <div key={j} className="h-4 bg-gray-200 rounded flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
}

/**
 * Stats grid skeleton
 */
export function StatsSkeleton({ count = 4 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <Skeleton key={i} variant="stat" />
            ))}
        </div>
    );
}
