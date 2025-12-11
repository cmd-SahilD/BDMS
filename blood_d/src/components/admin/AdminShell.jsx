"use client";
import Link from "next/link";
import { LayoutDashboard, ShieldCheck, Building2, Users, LogOut, Bell, ChevronDown, User, Settings } from "lucide-react";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminShell({ children, user }) {
    const pathname = usePathname();
    const [pendingCount, setPendingCount] = useState(0);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Fetch notifications client-side (non-critical)
    useEffect(() => {
        axios.get('/api/admin/facilities')
            .then(res => {
                const pending = res.data.filter(f => !f.isVerified).length;
                setPendingCount(pending);
            })
            .catch(console.error);
    }, []);

    const handleLogout = async () => {
        try {
            // Document cookie clearing as a fallback
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-10">
                <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-50">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-sm font-bold text-gray-900 block leading-none">BBMS Admin</span>
                        <span className="text-[10px] text-gray-400 font-medium">System Administration</span>
                    </div>
                </div>

                <div className="p-4">
                    <div className="text-xs font-semibold text-red-500 mb-4 px-2 uppercase tracking-wider">Admin Portal</div>
                    <nav className="space-y-1">
                        <NavItem href="/admin" icon={LayoutDashboard} label="Overview" active={pathname === '/admin'} />
                        <NavItem href="/admin/verification" icon={ShieldCheck} label="Verification" active={pathname === '/admin/verification'} count={pendingCount} />
                        <NavItem href="/admin/facilities" icon={Building2} label="Facilities" active={pathname === '/admin/facilities'} />
                        <NavItem href="/admin/donors" icon={Users} label="Donors" active={pathname === '/admin/donors'} />
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-gray-50">
                    <div className="px-4 py-3 text-xs text-gray-400 text-center">
                        BBMS v1.0.0
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-64 flex flex-col">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-gray-800">Admin Portal</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <button className="relative p-2 text-gray-400 hover:text-red-600 transition-colors">
                                <Bell className="w-5 h-5" />
                                {pendingCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                                )}
                            </button>
                            {pendingCount > 0 && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg p-2 text-xs text-gray-600 z-20">
                                    <strong>{pendingCount}</strong> Pending Facilities
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 pl-6 border-l border-gray-100 outline-none">
                                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm uppercase">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                                <div className="hidden md:block text-left">
                                    <span className="text-sm font-bold text-gray-900 block leading-none">
                                        {user?.name || 'Administrator'}
                                    </span>
                                    <span className="text-xs text-gray-500 capitalize">{user?.role || 'Admin'}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsProfileOpen(false)}
                                    ></div>
                                    <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-20">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-sm font-bold text-gray-900">{user?.name || 'Administrator'}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <div className="p-1">
                                            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                                <User className="w-4 h-4" />
                                                Profile
                                            </button>
                                            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </button>
                                        </div>
                                        <div className="border-t border-gray-50 p-1 mt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

function NavItem({ href, icon: Icon, label, active, count }) {
    return (
        <Link
            href={href}
            className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all
        ${active
                    ? 'bg-red-600 text-white shadow-md shadow-red-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
        >
            <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} />
                {label}
            </div>
            {count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'}`}>
                    {count}
                </span>
            )}
        </Link>
    );
}
