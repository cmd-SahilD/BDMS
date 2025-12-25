import Link from "next/link";
import { Menu, Plus } from "lucide-react";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <img src="/205916.png" alt="LifeSaver" className="h-12 w-auto object-contain" />
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900 leading-none tracking-tight">LifeSaver</span>
                        <span className="text-sm font-medium text-gray-500 leading-none">Blood Donation Management</span>
                    </div>
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
