import { Beaker, Users, Droplets, Activity, Calendar, Clock, Lock, ArrowRight } from "lucide-react";

export default function LabDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 2h14" /><path d="M5 22h14" /><path d="M12 2v20" /><path d="M16 10H8" /></svg>
                    Blood Lab Dashboard
                </h1>
                <p className="text-gray-500 text-sm mt-1">Comprehensive overview of your blood laboratory operations</p>
            </div>

            {/* Welcome Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18" /><path d="M5 21V7l8-4 8 4v14" /><path d="M17 21v-8.28A2 2 0 0 0 15.28 11h-2.56A2 2 0 0 0 11 12.72V21" /></svg>
                        Laboratory Overview
                    </h3>
                    <div className="flex flex-wrap gap-6 mt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-400 block uppercase">Email</span>
                                <span className="text-sm font-bold text-gray-900">pokemon@gmail.com</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-400 block uppercase">Phone</span>
                                <span className="text-sm font-bold text-gray-900">6666666666</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-400 block uppercase">Operating Hours</span>
                                <span className="text-sm font-bold text-gray-900">09:00 - 18:00</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-400 block uppercase">Location</span>
                                <span className="text-sm font-bold text-gray-900">Mumbai, Maharashtra</span>
                            </div>
                        </div>
                    </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                    Approved
                </span>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Camps" value="5" icon={Calendar} color="blue" />
                <StatCard title="Total Donors" value="0" icon={Users} color="green" />
                <StatCard title="Blood Units" value="724" sub="0 critical" icon={Droplets} color="red" />
                <StatCard title="Active Camps" value="2" icon={Activity} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Blood Inventory Levels */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-gray-400" />
                        Blood Inventory
                    </h3>
                    <p className="text-xs text-gray-500 mb-6 -mt-4">Current blood stock levels</p>
                    <div className="space-y-4">
                        <InventoryRow type="A+" units="109" />
                        <InventoryRow type="A-" units="104" />
                        <InventoryRow type="O+" units="10" />
                        <InventoryRow type="O-" units="501" />
                    </div>
                </div>

                {/* Recent Camps */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        Recent Blood Donation Camps
                    </h3>
                    <p className="text-xs text-gray-500 mb-6 -mt-4">Latest organized camps</p>
                    <div className="space-y-4">
                        <CampRow name="NMMC" date="11/30/2025" status="Ongoing" donors="50" color="gray" />
                        <CampRow name="hello" date="11/26/2025" status="Completed" donors="50" color="green" />
                        <CampRow name="pppppp" date="11/15/2025" status="Ongoing" donors="50" color="gray" />
                        <CampRow name="pokpo" date="11/14/2025" status="Upcoming" donors="5" color="yellow" />
                    </div>
                </div>
            </div>

            {/* Access History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-400" />
                    Access History
                </h3>
                <p className="text-xs text-gray-500 mb-6 -mt-4">Recent login activity</p>

                <div className="space-y-3">
                    <LogEntry title="System Access" detail="Facility logged in successfully" date="11/13/2025, 3:48:28 PM" />
                    <LogEntry title="System Access" detail="Facility logged in successfully" date="11/14/2025, 10:22:53 AM" />
                    <LogEntry title="System Access" detail="Facility logged in successfully" date="11/14/2025, 10:25:54 AM" />
                    <LogEntry title="System Access" detail="Facility logged in successfully" date="11/14/2025, 11:34:58 AM" />
                    <LogEntry title="System Access" detail="Facility logged in successfully" date="11/14/2025, 11:50:21 AM" />
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-gray-400" />
                    Recent Activity
                </h3>
                <p className="text-xs text-gray-500 mb-6 -mt-4">All laboratory activities</p>

                <div className="space-y-3">
                    <LogEntry title="Login" detail="Facility logged in successfully" date="11/13/2025, 3:46:28 PM" icon="blue" />
                    <LogEntry title="Login" detail="Facility logged in successfully" date="11/14/2025, 10:22:53 AM" icon="blue" />
                    <LogEntry title="Stock Update" detail="Added 100 units of A+" date="11/14/2025, 10:23:38 AM" icon="green" />
                    <LogEntry title="Stock Update" detail="Removed 100 units of A+" date="11/14/2025, 10:23:47 AM" icon="green" />
                    <LogEntry title="Login" detail="Facility logged in successfully" date="11/14/2025, 10:25:54 AM" icon="blue" />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, sub, icon: Icon, color }) {
    const borders = {
        blue: "border-l-4 border-l-blue-500",
        green: "border-l-4 border-l-green-500",
        red: "border-l-4 border-l-red-500",
        purple: "border-l-4 border-l-purple-500",
    }
    const colors = {
        blue: "text-blue-500",
        green: "text-green-500",
        red: "text-red-500",
        purple: "text-purple-500",
    }
    const bgColors = {
        blue: "bg-blue-100",
        green: "bg-green-100",
        red: "bg-red-100",
        purple: "bg-purple-100",
    }

    return (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 ${borders[color]} flex items-center justify-between`}>
            <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</span>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
                {sub && <span className="text-[10px] text-gray-400 font-medium">{sub}</span>}
            </div>
            <div className={`w-10 h-10 rounded-xl ${bgColors[color]} flex items-center justify-center ${colors[color]}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
    )
}

function InventoryRow({ type, units }) {
    return (
        <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl hover:bg-gray-50">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${type.includes('O') ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    <Droplets className="w-3.5 h-3.5 mr-1" />
                    {type}
                </div>
            </div>
            <span className="font-bold text-gray-900 text-sm">{units} units</span>
        </div>
    )
}

function CampRow({ name, date, status, donors, color }) {
    const statuses = {
        gray: "bg-gray-100 text-gray-600",
        green: "bg-green-100 text-green-600",
        yellow: "bg-yellow-100 text-yellow-600",
    }
    return (
        <div className="flex items-center justify-between p-3 border border-gray-50 rounded-xl">
            <div>
                <h4 className="font-bold text-gray-900 text-sm">{name}</h4>
                <p className="text-[10px] text-gray-500">{date}</p>
            </div>
            <div className="text-right">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${statuses[color]}`}>
                    {status}
                </span>
                <p className="text-[10px] text-gray-400 mt-0.5">{donors} donors</p>
            </div>
        </div>
    )
}

function LogEntry({ title, detail, date, icon }) {
    const iconColor = icon === 'green' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600';
    return (
        <div className="flex items-center justify-between py-3 px-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${icon ? iconColor : 'bg-blue-100 text-blue-600'}`}>
                    {icon === 'green'
                        ? <Droplets className="w-4 h-4" />
                        : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>
                    }
                </div>
                <div>
                    <h4 className="text-xs font-bold text-gray-800">{title}</h4>
                    <p className="text-[10px] text-gray-500">{detail}</p>
                </div>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">{date}</span>
        </div>
    )
}
