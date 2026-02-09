"use client";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

/**
 * Reusable search input with debounce
 * @param {Object} props
 * @param {string} props.value - Current search value
 * @param {function} props.onChange - Callback when search value changes
 * @param {string} props.placeholder - Input placeholder
 * @param {number} props.debounceMs - Debounce delay in ms (default: 300)
 */
export default function SearchInput({
    value = "",
    onChange,
    placeholder = "Search...",
    debounceMs = 300,
    className = ""
}) {
    const [localValue, setLocalValue] = useState(value);

    // Sync with external value
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Debounce the onChange callback
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onChange && localValue !== value) {
                onChange(localValue);
            }
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [localValue, debounceMs, onChange, value]);

    const handleClear = () => {
        setLocalValue("");
        onChange?.("");
    };

    return (
        <div className={`relative ${className}`}>
            <input
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 pl-10 pr-10 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            {localValue && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
