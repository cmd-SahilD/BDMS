import Link from "next/link";
import { LayoutDashboard, FileText, Droplets, User, History, LogOut, Bell, Building2 } from "lucide-react";

export default function HospitalLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-10">
                <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-50">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-sm font-bold text-gray-900 block leading-none">Hospital Management</span>
                        <span className="text-[10px] text-gray-400 font-medium">Blood Request & Inventory</span>
                    </div>
                </div>

                <div className="p-4">
                    <div className="text-xs font-semibold text-red-500 mb-4 px-2 uppercase tracking-wider">Hospital Portal</div>
                    <nav className="space-y-1">
                        <NavItem href="/hospital" icon={LayoutDashboard} label="Dashboard" active />
                        <NavItem href="/hospital/requests" icon={FileText} label="Blood Requests" />
                        <NavItem href="/hospital/inventory" icon={Droplets} label="Inventory" />
                        <NavItem href="/hospital/donors" icon={User} label="Donors" />
                        <NavItem href="/hospital/history" icon={History} label="History" />
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-gray-50">
                    <Link href="/login" className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-64 flex flex-col">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-gray-800">Hospital Portal</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-red-600 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                                R
                            </div>
                            <div className="text-right hidden md:block">
                                <span className="text-sm font-bold text-gray-900 block leading-none">Red Cross Hospital</span>
                                <span className="text-xs text-gray-500">Hospital</span>
                            </div>
                            <LogOut className="w-4 h-4 text-red-400" />
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
