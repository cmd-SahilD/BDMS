import Link from "next/link";
import { LayoutDashboard, Beaker, Users, Tent, FileText, UserCircle, LogOut, Bell } from "lucide-react";

export default function LabLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-10">
                <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-50">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600 font-bold">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3M9 14h6m-6 5h6" /></svg>
                    </div>
                    <div>
                        <span className="text-sm font-bold text-gray-900 block leading-none">Blood Lab Center</span>
                        <span className="text-[10px] text-gray-400 font-medium">Testing & Quality Control</span>
                    </div>
                </div>

                <div className="p-4">
                    <div className="text-xs font-semibold text-red-500 mb-4 px-2 uppercase tracking-wider">Lab Portal</div>
                    <nav className="space-y-1">
                        <NavItem href="/lab" icon={LayoutDashboard} label="Dashboard" active />
                        <NavItem href="/lab/inventory" icon={Beaker} label="Inventory" />
                        <NavItem href="/lab/donors" icon={Users} label="Donors" />
                        <NavItem href="/lab/camps" icon={Tent} label="Camps" />
                        <NavItem href="/lab/requests" icon={FileText} label="Requests" />
                        <NavItem href="/lab/profile" icon={UserCircle} label="Profile" />
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
                        <h2 className="text-lg font-bold text-gray-800">Lab Portal</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 bg-white flex items-center gap-2">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16.24V21h5" /></svg>
                            Refresh Data
                        </button>
                        <div className="w-px h-6 bg-gray-100"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                                P
                            </div>
                            <div className="text-right hidden md:block">
                                <span className="text-sm font-bold text-gray-900 block leading-none">pokemon center</span>
                                <span className="text-xs text-gray-500">Blood-Lab</span>
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
