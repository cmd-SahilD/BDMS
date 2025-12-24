import { Users, Droplets, Activity, Calendar, Clock, Lock, ArrowRight, History } from "lucide-react";
import Link from "next/link";

export default function LabDashboard() {
    return (
        <div className="space-y-8">
            {/* Management Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start gap-6 hover:shadow-md transition-shadow group">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
                        <History className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 font-display">Donation History</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">View all donation records, analytics, and reports</p>
                    </div>
                    <Link 
                        href="/blood-bank/donations"
                        className="w-full py-3.5 bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-100 mt-2"
                    >
                        Manage <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start gap-6 hover:shadow-md transition-shadow group">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 font-display">Blood Camps</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">Monitor and manage upcoming blood donation camps</p>
                    </div>
                    <Link 
                        href="/blood-bank/camps"
                        className="w-full py-3.5 bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-100 mt-2"
                    >
                        View Camps <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
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
