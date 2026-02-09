"use client";
import { useEffect, useState, useMemo } from "react";
import { Droplets, AlertTriangle, CheckCircle2, Clock, Search, Building2, RefreshCw } from "lucide-react";
import axios from "axios";
import { getCompatibleRecipients } from "@/lib/bloodMatching";
import Skeleton from "@/components/ui/Skeleton";

export default function HospitalInventoryPage() {
    const [hospitalInventory, setHospitalInventory] = useState([]);
    const [bloodBankInventory, setBloodBankInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUnits: 0,
        bloodTypes: 0,
        lowStock: 0,
        expiringSoon: 0
    });

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/inventory?includeBloodBanks=true');

            if (response.data.hospitalInventory) {
                // API returned split data
                setHospitalInventory(response.data.hospitalInventory || []);
                setBloodBankInventory(response.data.bloodBankInventory || []);

                const inventory = response.data.hospitalInventory || [];
                setStats({
                    totalUnits: inventory.reduce((acc, item) => acc + item.units, 0),
                    bloodTypes: new Set(inventory.filter(i => i.units > 0).map(i => i.bloodType)).size,
                    lowStock: inventory.filter(i => i.units < 10 && i.units > 0).length,
                    expiringSoon: inventory.filter(i => {
                        if (!i.expiryDate) return false;
                        const daysToExpiry = Math.ceil((new Date(i.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                        return daysToExpiry <= 7 && daysToExpiry > 0;
                    }).length
                });
            } else {
                // Fallback for old API format
                setHospitalInventory(response.data || []);
            }
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

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
                    <p className="text-gray-500 text-sm ml-13">View your hospital's inventory and available blood bank stock</p>
                </div>
                <button
                    onClick={fetchInventory}
                    className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={loading}
                >
                    <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard value={stats.totalUnits} label="Total Units" icon={Droplets} color="blue" />
                <StatCard value={stats.bloodTypes} label="Blood Types" icon={CheckCircle2} color="green" />
                <StatCard value={stats.lowStock} label="Low Stock" icon={AlertTriangle} color="yellow" />
                <StatCard value={stats.expiringSoon} label="Expiring Soon" icon={Clock} color="red" />
            </div>

            {/* Hospital's Own Inventory */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gradient-to-r from-blue-50 to-white">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        Your Hospital Inventory
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Blood stock currently held by your facility</p>
                </div>

                {loading ? (
                    <div className="p-6 space-y-3">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                    </div>
                ) : hospitalInventory.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {hospitalInventory.map((item) => (
                            <HospitalInventoryRow
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

            {/* Blood Bank Inventory */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gradient-to-r from-red-50 to-white">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-red-500" />
                        Available from Blood Banks
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Aggregated blood stock from all verified blood banks</p>
                </div>

                {loading ? (
                    <div className="p-6 space-y-3">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                    </div>
                ) : bloodBankInventory.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {bloodBankInventory.map((item) => (
                            <BloodBankInventoryRow
                                key={item.bloodType}
                                type={item.bloodType}
                                units={item.totalUnits}
                                sources={item.sources}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <Building2 className="w-8 h-8 text-gray-300" />
                        </div>
                        <h4 className="font-bold text-gray-700 mb-2">No Blood Bank Stock</h4>
                        <p className="text-gray-500 text-sm">Blood banks currently don't have any inventory available.</p>
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

function HospitalInventoryRow({ type, units, status, expiryDate, updatedAt }) {
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

function BloodBankInventoryRow({ type, units, sources }) {
    const recipients = useMemo(() => getCompatibleRecipients(type), [type]);
    const [showSources, setShowSources] = useState(false);

    return (
        <div className="p-5 hover:bg-red-50/30 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm
                        ${type === 'O-' ? 'bg-red-600 text-white' :
                            type.includes('+') ? 'bg-red-50 text-red-600 border border-red-100' :
                                'bg-purple-50 text-purple-600 border border-purple-100'}`}>
                        {type}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                            {units} Units Available
                            <span className="text-[10px] font-normal text-gray-400">from {sources.length} blood bank{sources.length !== 1 ? 's' : ''}</span>
                        </h4>
                        <p className="text-[10px] text-gray-500">
                            Can give to: <span className="text-gray-700 font-medium">{recipients.join(', ')}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider ${units < 10 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                        {units < 10 ? 'Limited' : 'Available'}
                    </span>
                    <button
                        onClick={() => setShowSources(!showSources)}
                        className="text-xs text-red-600 hover:text-red-700 font-medium underline"
                    >
                        {showSources ? 'Hide' : 'View'} Sources
                    </button>
                </div>
            </div>

            {showSources && (
                <div className="mt-4 pl-16 space-y-2">
                    {sources.map((source, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <span className="text-xs font-medium text-gray-700">{source.facilityName}</span>
                            </div>
                            <span className="text-xs text-gray-500">{source.units} units</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
