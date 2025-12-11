import Link from "next/link";
import { Menu } from "lucide-react";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                        B
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                        BloodConnect
                    </span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">
                        Home
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">
                        About
                    </Link>
                    <Link href="/find-blood" className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">
                        Find Blood
                    </Link>
                    <Link href="/register" className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">
                        Register Now
                    </Link>
                </nav>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-bold text-gray-700 hover:text-red-600 transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        href="/donate"
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors shadow-md shadow-red-200"
                    >
                        Donate Now
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                    <Menu className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
