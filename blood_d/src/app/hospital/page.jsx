import { Droplets, Activity, AlertTriangle, Clock, TrendingUp, CheckCircle2 } from "lucide-react";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Inventory from "@/models/Inventory";
import Request from "@/models/Request";

export default async function HospitalDashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    let user = null;
    let inventory = [];
    let requests = [];
    let stats = {
        totalUnits: 0,
        bloodTypes: 0,
        lowStock: 0,
        expiringSoon: 0,
        pendingRequests: 0
    };

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change");
            const { payload } = await jwtVerify(token, secret);

            await connectToDatabase();
            user = await User.findById(payload.userId);
            
            if (user) {
                // Fetch inventory
                inventory = await Inventory.find({ facilityId: user._id });
                
                // Fetch recent requests
                requests = await Request.find({ 
                    $or: [
                        { requesterId: user._id },
                        { providerId: user._id }
                    ]
                })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('requesterId', 'facilityName name')
                .populate('providerId', 'facilityName name');

                // Calculate stats
                stats.totalUnits = inventory.reduce((acc, item) => acc + item.units, 0);
                stats.bloodTypes = new Set(inventory.filter(i => i.units > 0).map(i => i.bloodType)).size;
                stats.lowStock = inventory.filter(i => i.units < 10 && i.units > 0).length;
                
                const pending = await Request.countDocuments({ 
                    requesterId: user._id, 
                    status: "Pending" 
                });
                stats.pendingRequests = pending;
            }
        } catch (error) {
            console.error("Dashboard Data Fetch Error:", error.message);
        }
    }

    if (!user) {
        return <div className="p-12 text-center text-gray-500 font-medium tracking-tight">Please login to view dashboard.</div>;
    }

    const formattedAddress = user.address ? (
        typeof user.address === 'string' ? user.address : 
        `${user.address.street || ''} ${user.address.city || ''} ${user.address.state || ''} ${user.address.zip || ''}`.trim()
    ) : "No address provided";

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hospital Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Welcome back, {user.name}! Here's your hospital overview.</p>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                        <Building2Icon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-bold text-gray-900 truncate">{user.facilityName || user.name}</h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                            <span className="truncate">{user.email}</span>
                            <span className="truncate">{formattedAddress}</span>
                            <span>{user.phone || "No phone"}</span>
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">Category: Private</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {user.isVerified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {user.isVerified ? 'Approved' : 'Pending Verification'}
                    </span>
                    <p className="text-[10px] text-gray-400">Last Login: {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <StatCard value={stats.totalUnits} label="Total Blood Units" icon={Droplets} color="blue" />
                <StatCard value={stats.bloodTypes} label="Blood Types" icon={Activity} color="green" />
                <StatCard value={stats.lowStock} label="Low Stock" icon={AlertTriangle} color="yellow" />
                <StatCard value={stats.expiringSoon} label="Expiring Soon" icon={Clock} color="red" />
                <StatCard value={stats.pendingRequests} label="Pending Requests" icon={TrendingUp} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Blood Inventory */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-red-500" />
                        Blood Inventory
                    </h3>
                    <div className="space-y-4">
                        {inventory.length > 0 ? (
                            inventory.map((item) => (
                                <InventoryItem key={item._id} type={item.bloodType} units={`${item.units} units`} status={item.status || "Good"} />
                            ))
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl text-gray-400 text-sm border-2 border-dashed border-gray-100">
                                No inventory records found
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Requests */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-500" />
                        Recent Blood Requests
                    </h3>

                    <div className="space-y-4">
                        {requests.length > 0 ? (
                            requests.map((req) => (
                                <RequestItem 
                                    key={req._id} 
                                    type={req.bloodType} 
                                    units={`${req.units} units`} 
                                    hospital={req.requesterId?._id.toString() === user._id.toString() ? (req.providerId?.facilityName || req.providerId?.name || "Provider") : (req.requesterId?.facilityName || req.requesterId?.name || "Requester")} 
                                    status={req.status.toLowerCase()} 
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl text-gray-400 text-sm border-2 border-dashed border-gray-100">
                                No recent requests found
                            </div>
                        )}
                    </div>

                    {requests.length > 0 && (
                        <button className="w-full text-center text-red-600 text-sm font-bold mt-6 hover:bg-red-50 py-2 rounded-xl transition-colors border border-transparent hover:border-red-100">
                            View All Requests
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ value, label, icon: Icon, color }) {
    const accents = {
        blue: "text-blue-500 bg-blue-50",
        green: "text-green-500 bg-green-50",
        yellow: "text-yellow-500 bg-yellow-50",
        red: "text-red-500 bg-red-50",
        purple: "text-purple-500 bg-purple-50",
    }

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-gray-200 transition-colors">
            <div className={`p-2.5 rounded-xl ${accents[color]}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
                <h3 className="text-lg font-bold text-gray-900 leading-none mb-1">{value}</h3>
                <span className="block text-gray-500 text-[10px] font-bold uppercase tracking-wider truncate">{label}</span>
            </div>
        </div>
    )
}

function InventoryItem({ type, units, status }) {
    const isRed = type.includes('A') || type.includes('O');
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition-all">
            <div className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${isRed ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {type}
                </div>
                <div>
                    <span className="font-bold text-gray-900 text-sm block leading-none mb-1">{units}</span>
                    <span className="text-[10px] text-gray-400 font-medium">Available Stock</span>
                </div>
            </div>
            <div className="flex items-center gap-1.5 text-green-600 text-[10px] font-bold uppercase tracking-wider bg-green-50 px-2 py-1 rounded-lg">
                <CheckCircle2 className="w-3 h-3" />
                {status}
            </div>
        </div>
    )
}

function RequestItem({ type, units, hospital, status }) {
    const badges = {
        pending: "bg-orange-100 text-orange-600 border-orange-200",
        rejected: "bg-red-100 text-red-600 border-red-200",
        accepted: "bg-green-100 text-green-600 border-green-200",
        completed: "bg-blue-100 text-blue-600 border-blue-200",
    }
    return (
        <div className="flex items-center justify-between p-4 border border-gray-50 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-bold text-gray-900 text-sm">{type}</h5>
                    <span className="text-[10px] text-gray-400">•</span>
                    <span className="text-[10px] font-bold text-gray-600">{units}</span>
                </div>
                <p className="text-[10px] text-gray-500 truncate font-medium">{hospital}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-[9px] uppercase font-bold tracking-wider border shadow-sm ${badges[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                {status}
            </span>
        </div>
    )
}

function Building2Icon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
            <path d="M10 6h4" />
            <path d="M10 10h4" />
            <path d="M10 14h4" />
            <path d="M10 18h4" />
        </svg>
    )
}
