import Link from "next/link";
import { Menu, Plus } from "lucide-react";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                        <Plus size={20} strokeWidth={4} />
                    </div>
                    <span className="text-xl font-bold text-red-700">
                        Blood Donation System
                    </span>
                </Link>

                {/* Auth Buttons */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/login"
                        className="text-sm font-semibold text-gray-700 hover:text-red-700 transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/register"
                        className="px-6 py-2.5 text-sm font-semibold text-white bg-red-700 rounded-md hover:bg-red-800 transition-colors shadow-sm"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </header>
    );
}
