"use client";
import Link from "next/link";
import { LayoutDashboard, FileText, Droplets, User, History, LogOut, Bell, ChevronDown, Settings, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { usePathname } from 'next/navigation';
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { getTimeAgo } from "@/lib/formatters";
import NavItem from "@/components/shell/NavItem";
import { getNotificationIcon } from "@/components/shell/NotificationIcon";

export default function HospitalShell({ children, user }) {
    const pathname = usePathname();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    
    const { logout } = useAuth();
    const { notifications, unreadCount, refresh: refreshNotifications } = useNotifications();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-10">
                <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-50">
                    <img src="/205916.png" alt="Logo" className="w-8 h-8 object-contain" />
                    <div 
                        className="cursor-pointer" 
                        onClick={() => window.location.reload()}
                        title="Click to reload page"
                    >
                        <span className="text-sm font-bold text-gray-900 block leading-none">LifeSaver</span>
                        <span className="text-[10px] text-gray-400 font-medium">Blood Donation Management</span>
                    </div>
                </div>

                <div className="p-4">
                    <div className="text-xs font-semibold text-red-500 mb-4 px-2 uppercase tracking-wider">Hospital Portal</div>
                    <nav className="space-y-1">
                        <NavItem href="/hospital" icon={LayoutDashboard} label="Dashboard" active={pathname === '/hospital'} />
                        <NavItem href="/hospital/requests" icon={FileText} label="Blood Requests" active={pathname === '/hospital/requests'} />
                        <NavItem href="/hospital/inventory" icon={Droplets} label="Inventory" active={pathname === '/hospital/inventory'} />
                        <NavItem href="/hospital/donors" icon={User} label="Donors" active={pathname === '/hospital/donors'} />
                        <NavItem href="/hospital/history" icon={History} label="History" active={pathname === '/hospital/history'} />
                    </nav>
                </div>

            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-64 flex flex-col">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-gray-800">Hospital Portal</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button 
                                onClick={() => {
                                    setIsNotificationsOpen(!isNotificationsOpen);
                                    setIsProfileOpen(false);
                                }}
                                className="relative p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center px-1">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {isNotificationsOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsNotificationsOpen(false)}
                                    ></div>
                                    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between bg-gray-50">
                                            <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                                            <span className="text-[10px] text-gray-500">{notifications.length} items</span>
                                        </div>
                                        
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map((notif, index) => (
                                                    <div 
                                                        key={notif.id || index}
                                                        className="px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="mt-0.5">
                                                                {getNotificationIcon(notif.type)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs text-gray-700 leading-relaxed">{notif.message}</p>
                                                                <p className="text-[10px] text-gray-400 mt-1">{getTimeAgo(notif.time)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-8 text-center">
                                                    <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                                    <p className="text-xs text-gray-500">No notifications yet</p>
                                                </div>
                                            )}
                                        </div>

                                        {notifications.length > 0 && (
                                            <div className="px-4 py-2 border-t border-gray-50 bg-gray-50">
                                                <button 
                                                    onClick={refreshNotifications}
                                                    className="w-full text-center text-xs text-red-600 font-bold hover:text-red-700"
                                                >
                                                    Refresh
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => {
                                    setIsProfileOpen(!isProfileOpen);
                                    setIsNotificationsOpen(false);
                                }}
                                className="flex items-center gap-3 pl-6 border-l border-gray-100 outline-none">
                                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                                    {user?.name?.charAt(0) || 'H'}
                                </div>
                                <div className="hidden md:block text-left">
                                    <span className="text-sm font-bold text-gray-900 block leading-none">
                                        {user?.name || 'Hospital'}
                                    </span>
                                    <span className="text-xs text-gray-500 capitalize">{user?.role || 'Hospital'}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Profile Dropdown Menu */}
                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsProfileOpen(false)}
                                    ></div>
                                    <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-sm font-bold text-gray-900">{user?.name || 'Hospital User'}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <div className="p-1">
                                            <Link href="/hospital/profile" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                                <User className="w-4 h-4" />
                                                Profile
                                            </Link>
                                            <Link href="/hospital/settings" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
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
