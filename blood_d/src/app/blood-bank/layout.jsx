"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, Beaker, Users, Tent, FileText, UserCircle, LogOut, History } from "lucide-react";

export default function LabLayout({ children }) {
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        // Fetch user from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-10">
                <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-50">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600 font-bold">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3M9 14h6m-6 5h6" /></svg>
                    </div>
                    <div 
                        className="cursor-pointer" 
                        onClick={() => window.location.reload()}
                        title="Click to reload page"
                    >
                        <span className="text-sm font-bold text-gray-900 block leading-none">Blood Bank Center</span>
                        <span className="text-[10px] text-gray-400 font-medium">Testing & Quality Control</span>
                    </div>
                </div>

                <div className="p-4">
                    <div className="text-xs font-semibold text-red-500 mb-4 px-2 uppercase tracking-wider">Blood Bank Portal</div>
                    <nav className="space-y-1">
                        <NavItem href="/blood-bank" icon={LayoutDashboard} label="Dashboard" active={pathname === "/blood-bank"} />
                        <NavItem href="/blood-bank/inventory" icon={Beaker} label="Inventory" active={pathname.startsWith("/blood-bank/inventory")} />
                        <NavItem href="/blood-bank/donors" icon={Users} label="Donors" active={pathname.startsWith("/blood-bank/donors")} />
                        <NavItem href="/blood-bank/donations" icon={History} label="Donations" active={pathname.startsWith("/blood-bank/donations")} />
                        <NavItem href="/blood-bank/camps" icon={Tent} label="Camps" active={pathname.startsWith("/blood-bank/camps")} />
                        <NavItem href="/blood-bank/requests" icon={FileText} label="Requests" active={pathname.startsWith("/blood-bank/requests")} />

                    </nav>
                </div>


            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-64 flex flex-col">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-gray-800">Blood Bank Portal</h2>
                    </div>

                    <div className="flex items-center gap-6">


                        {/* User Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 outline-none"
                            >
                                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                                    {user?.name?.charAt(0) || 'B'}
                                </div>
                                <div className="text-right hidden md:block">
                                    <span className="text-sm font-bold text-gray-900 block leading-none">{user?.name || 'Blood Bank Center'}</span>
                                    <span className="text-xs text-gray-500">{user?.role === 'lab' ? 'Blood Bank' : 'Lab User'}</span>
                                </div>
                                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                                    <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-20">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-sm font-bold text-gray-900">{user?.name || 'Blood Bank User'}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <div className="p-1">
                                            <Link href="/blood-bank/profile" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                <UserCircle className="w-4 h-4" />
                                                Profile
                                            </Link>
                                            <Link href="/blood-bank/settings" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                                                Settings
                                            </Link>
                                        </div>
                                        <div className="border-t border-gray-50 p-1 mt-1">
                                            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

function NavItem({ href, icon: Icon, label, active }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all
        ${active
                    ? 'bg-red-600 text-white shadow-md shadow-red-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
        >
            <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} />
            {label}
        </Link>
    );
}
