import { Droplets, AlertTriangle, CheckCircle2, Clock, Search } from "lucide-react";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Inventory from "@/models/Inventory";

export default async function HospitalInventoryPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    let user = null;
    let inventory = [];
    let stats = {
        totalUnits: 0,
        bloodTypes: 0,
        lowStock: 0,
        expiringSoon: 0
    };

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change");
            const { payload } = await jwtVerify(token, secret);

            await connectToDatabase();
            user = await User.findById(payload.userId);
            
            if (user) {
                inventory = await Inventory.find({ facilityId: user._id }).sort({ bloodType: 1 });
                
                stats.totalUnits = inventory.reduce((acc, item) => acc + item.units, 0);
                stats.bloodTypes = new Set(inventory.filter(i => i.units > 0).map(i => i.bloodType)).size;
                stats.lowStock = inventory.filter(i => i.units < 10 && i.units > 0).length;
                stats.expiringSoon = inventory.filter(i => {
                    if (!i.expiryDate) return false;
                    const daysToExpiry = Math.ceil((new Date(i.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                    return daysToExpiry <= 7 && daysToExpiry > 0;
                }).length;
            }
        } catch (error) {
            console.error("Inventory Fetch Error:", error.message);
        }
    }

    if (!user) {
        return <div className="p-12 text-center text-gray-500 font-medium">Please login to view inventory.</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                            <Droplets className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Blood Inventory</h1>
                    </div>
                    <p className="text-gray-500 text-sm ml-13">View and manage your hospital's blood stock</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard value={stats.totalUnits} label="Total Units" icon={Droplets} color="blue" />
                <StatCard value={stats.bloodTypes} label="Blood Types" icon={CheckCircle2} color="green" />
                <StatCard value={stats.lowStock} label="Low Stock" icon={AlertTriangle} color="yellow" />
                <StatCard value={stats.expiringSoon} label="Expiring Soon" icon={Clock} color="red" />
            </div>

            {/* Inventory Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-red-500" />
                        Blood Stock Details
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">All blood types in your inventory</p>
                </div>

                {inventory.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {inventory.map((item) => (
                            <InventoryRow 
                                key={item._id} 
                                type={item.bloodType} 
                                units={item.units} 
                                status={item.status || "Adequate"}
                                expiryDate={item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "N/A"}
                                updatedAt={new Date(item.updatedAt).toLocaleDateString()}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <Droplets className="w-8 h-8 text-gray-300" />
                        </div>
                        <h4 className="font-bold text-gray-700 mb-2">No Inventory Records</h4>
                        <p className="text-gray-500 text-sm">You don't have any blood inventory yet. Request blood from blood banks to build your stock.</p>
                    </div>
                )}
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
    };

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
    );
}

function InventoryRow({ type, units, status, expiryDate, updatedAt }) {
    const statusColors = {
        Adequate: "bg-green-100 text-green-600",
        Low: "bg-yellow-100 text-yellow-600",
        Critical: "bg-red-100 text-red-600",
        Surplus: "bg-blue-100 text-blue-600",
    };

    const isLow = units < 10;

    return (
        <div className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${type.includes('O') ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                    {type}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">{units} Units</h4>
                    <p className="text-[10px] text-gray-500">Last updated: {updatedAt}</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-medium">Expires</p>
                    <p className="text-xs text-gray-700 font-mono">{expiryDate}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider ${statusColors[status] || statusColors.Adequate}`}>
                    {isLow ? "Low" : status}
                </span>
            </div>
        </div>
    );
}
