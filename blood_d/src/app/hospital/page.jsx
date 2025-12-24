import { Droplets, Activity, AlertTriangle, Clock, TrendingUp, CheckCircle2 } from "lucide-react";

export default function HospitalDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hospital Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Welcome back! Here's your hospital overview.</p>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex  items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 2 6 18" /><path d="M21 6h-5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5" /></svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Red Cross Hospital</h2>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span>redcross@gmail.com</span>
                            <span>123 MG Road, Mumbai, Maharashtra - 400001</span>
                            <span>6546546546</span>
                            <span>Category: Private</span>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide rounded-full mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approved
                    </span>
                    <p className="text-[10px] text-gray-400">Last Login: 12/1/2025, 3:23:42 PM</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard value="67" label="Total Blood Units" icon={Droplets} color="blue" />
                <StatCard value="2" label="Blood Types" icon={Activity} color="green" />
                <StatCard value="0" label="Low Stock" icon={AlertTriangle} color="yellow" />
                <StatCard value="0" label="Expiring Soon" icon={Clock} color="red" />
                <StatCard value="0" label="Pending Requests" icon={TrendingUp} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Blood Inventory */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-red-500" />
                        Blood Inventory
                    </h3>
                    <div className="space-y-4">
                        <InventoryItem type="A+" units="16 units" status="Good" />
                        <InventoryItem type="B+" units="51 units" status="Good" />
                    </div>
                </div>

                {/* Recent Requests */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-500" />
                        Recent Blood Requests
                    </h3>

                    <div className="space-y-4">
                        <RequestItem type="B+" units="50 units" hospital="pokemon center" status="rejected" />
                        <RequestItem type="B+" units="50 units" hospital="pokemon center" status="accepted" />
                        <RequestItem type="B+" units="1 units" hospital="pokemon center" status="accepted" />
                        <RequestItem type="A+" units="1 units" hospital="pokemon center" status="accepted" />
                        <RequestItem type="A+" units="5 units" hospital="pokemon center" status="accepted" />
                    </div>

                    <button className="w-full text-center text-red-600 text-sm font-bold mt-4 hover:underline">
                        View All 10 Requests
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Logins */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        Recent Logins
                    </h3>
                    <div className="space-y-6">
                        <LoginItem date="11/14/2025, 10:29:15 AM" />
                        <LoginItem date="11/26/2025, 10:55:13 PM" />
                        <LoginItem date="11/27/2025, 12:19:19 AM" />
                        <LoginItem date="11/27/2025, 12:21:54 PM" />
                        <LoginItem date="11/27/2025, 8:39:14 PM" />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        Recent Activity
                    </h3>

                    <div className="space-y-6">
                        <ActivityItem action="Stock Update" detail="Requested 10 units of A+ from pokemon center" date="11/27/2025" />
                        <ActivityItem action="Stock Update" detail="Received 10 units of A+ from blood bank" date="11/27/2025" />
                        <ActivityItem action="Stock Update" detail="Requested 5 units of A+ from pokemon center" date="11/27/2025" />
                        <ActivityItem action="Stock Update" detail="Received 5 units of A+ from blood bank" date="11/27/2025" />
                        <ActivityItem action="Stock Update" detail="Requested 1 units of A+ from pokemon center" date="11/27/2025" />
                        <ActivityItem action="Stock Update" detail="Received 1 units of A+ from blood bank" date="11/27/2025" />
                        <ActivityItem action="Stock Update" detail="Requested 1 units of B+ from pokemon center" date="11/29/2025" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ value, label, icon: Icon, color }) {
    const borders = {
        blue: "border-l-4 border-l-blue-500",
        green: "border-l-4 border-l-green-500",
        yellow: "border-l-4 border-l-yellow-500",
        red: "border-l-4 border-l-red-500",
        purple: "border-l-4 border-l-purple-500",
    }
    const icons = {
        blue: "text-blue-500",
        green: "text-green-500",
        yellow: "text-yellow-500",
        red: "text-red-500",
        purple: "text-purple-500",
    }

    return (
        <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 ${borders[color]}`}>
            <div className={`p-2 rounded-lg bg-gray-50 ${icons[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-900 leading-none mb-1">{value}</h3>
                <span className="block text-gray-500 text-xs font-medium">{label}</span>
            </div>
        </div>
    )
}

function InventoryItem({ type, units, status }) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${type === 'A+' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {type}
                </div>
                <span className="font-bold text-gray-900 text-sm">{units}</span>
            </div>
            <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {status}
            </div>
        </div>
    )
}

function RequestItem({ type, units, hospital, status }) {
    const badges = {
        rejected: "bg-red-100 text-red-600",
        accepted: "bg-green-100 text-green-600",
    }
    return (
        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
            <div>
                <h5 className="font-bold text-gray-900 text-xs mb-1">{type}</h5>
                <p className="text-[10px] text-gray-500">{units} • {hospital}</p>
            </div>
            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wide ${badges[status]}`}>
                {status}
            </span>
        </div>
    )
}

function LoginItem({ date }) {
    return (
        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50">
            <div>
                <h5 className="font-bold text-gray-800 text-xs mb-1">Facilities Login</h5>
                <p className="text-[10px] text-gray-500">{date}</p>
            </div>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
        </div>
    )
}

function ActivityItem({ action, detail, date }) {
    return (
        <div className="flex items-start justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
            <div>
                <h5 className="font-bold text-gray-800 text-xs mb-1">{action}</h5>
                <p className="text-[10px] text-gray-500">{detail}</p>
            </div>
            <span className="text-[10px] text-gray-400 font-mono whitespace-nowrap ml-4">{date}</span>
        </div>
    )
}
