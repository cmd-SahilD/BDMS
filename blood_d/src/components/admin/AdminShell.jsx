"use client";
import Link from "next/link";
import { LayoutDashboard, ShieldCheck, Building2, Users, LogOut, Bell, ChevronDown, User, Settings, History, Tent } from "lucide-react";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import NavItem from "@/components/shell/NavItem";

export default function AdminShell({ children, user }) {
    const pathname = usePathname();
    const [pendingCount, setPendingCount] = useState(0);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const { logout } = useAuth();

    // Fetch pending count client-side
    useEffect(() => {
        axios.get('/api/admin/pending')
            .then(res => {
                setPendingCount(res.data.length);
            })
            .catch(console.error);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-10">
                <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-50">
                    <img src="/205916.png" alt="Logo" className="w-8 h-8 object-contain" />
                    <div>
                        <span className="text-sm font-bold text-gray-900 block leading-none">LifeSaver</span>
                        <span className="text-[10px] text-gray-400 font-medium">Blood Donation Management</span>
                    </div>
                </div>

                <div className="p-4">
                    <div className="text-xs font-semibold text-red-500 mb-4 px-2 uppercase tracking-wider">Admin Portal</div>
                    <nav className="space-y-1">
                        <NavItem href="/admin" icon={LayoutDashboard} label="Overview" active={pathname === '/admin'} />
                        <NavItem href="/admin/verification" icon={ShieldCheck} label="Verification" active={pathname === '/admin/verification'} count={pendingCount} />
                        <NavItem href="/admin/facilities" icon={Building2} label="Facilities" active={pathname === '/admin/facilities'} />
                        <NavItem href="/admin/donors" icon={Users} label="Donors" active={pathname === '/admin/donors'} />
                        <NavItem href="/admin/donations" icon={History} label="Donations" active={pathname === '/admin/donations'} />
                        <NavItem href="/admin/camps" icon={Tent} label="Blood Camps" active={pathname === '/admin/camps'} />
                    </nav>
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
                            <button 
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="relative p-2 text-gray-400 hover:text-red-600 transition-colors outline-none"
                            >
                                <Bell className="w-5 h-5" />
                                {pendingCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                                )}
                            </button>
                            
                            {isNotificationsOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsNotificationsOpen(false)}
                                    ></div>
                                    <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50 flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Notifications</span>
                                            {pendingCount > 0 && (
                                                <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                                                    {pendingCount} New
                                                </span>
                                            )}
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {pendingCount > 0 ? (
                                                <Link 
                                                    href="/admin/verification" 
                                                    onClick={() => setIsNotificationsOpen(false)}
                                                    className="block p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                                >
                                                    <div className="flex gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                                                            <ShieldCheck className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-900">Pending Registrations</p>
                                                            <p className="text-[10px] text-gray-500 mt-0.5">There are {pendingCount} new accounts waiting for verification.</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mx-auto mb-3">
                                                        <Bell className="w-5 h-5" />
                                                    </div>
                                                    <p className="text-xs text-gray-500">No new notifications</p>
                                                </div>
                                            )}
                                        </div>
                                        {pendingCount > 0 && (
                                            <Link 
                                                href="/admin/verification"
                                                onClick={() => setIsNotificationsOpen(false)}
                                                className="block py-2 text-center text-[10px] font-bold text-red-600 hover:bg-red-50 transition-colors uppercase tracking-tight"
                                            >
                                                View All Requests
                                            </Link>
                                        )}
                                    </div>
                                </>
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
                                            <Link href="/admin/profile" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                                <User className="w-4 h-4" />
                                                Profile
                                            </Link>
                                            <Link href="/admin/settings" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </Link>
                                        </div>
                                        <div className="border-t border-gray-50 p-1 mt-1">
                                            <button
                                                onClick={logout}
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
