"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, Beaker, Users, Tent, FileText, UserCircle, LogOut, History, Bell, ChevronDown, Settings, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";
import axios from "axios";

export default function BloodBankShell({ children, user }) {
    const pathname = usePathname();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/notifications');
            setNotifications(response.data.notifications || []);
            setUnreadCount(response.data.unreadCount || 0);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        window.location.href = "/login";
    };

    const getNotificationIcon = (type) => {
        switch(type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'camp': return <Calendar className="w-4 h-4 text-purple-500" />;
            default: return <Clock className="w-4 h-4 text-blue-500" />;
        }
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

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
                                    <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)}></div>
                                    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden">
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
                                                            <div className="mt-0.5">{getNotificationIcon(notif.type)}</div>
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
                                                <button onClick={fetchNotifications} className="w-full text-center text-xs text-red-600 font-bold hover:text-red-700">
                                                    Refresh
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* User Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setIsProfileOpen(!isProfileOpen);
                                    setIsNotificationsOpen(false);
                                }}
                                className="flex items-center gap-3 pl-6 border-l border-gray-100 outline-none"
                            >
                                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                                    {(user?.facilityName || user?.name)?.charAt(0) || 'B'}
                                </div>
                                <div className="text-right hidden md:block">
                                    <span className="text-sm font-bold text-gray-900 block leading-none">{user?.facilityName || user?.name || 'Blood Bank'}</span>
                                    <span className="text-xs text-gray-500 capitalize">{user?.role === 'blood-bank' ? 'Blood Bank' : user?.role}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                                    <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-20">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-sm font-bold text-gray-900">{user?.facilityName || user?.name || 'Blood Bank User'}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <div className="p-1">
                                            <Link href="/blood-bank/profile" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                <UserCircle className="w-4 h-4" />
                                                Profile
                                            </Link>
                                            <Link href="/blood-bank/settings" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                <Settings className="w-4 h-4" />
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
