"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import axios from "axios";
import { getCompatibleRecipients, BLOOD_COMPATIBILITY } from "@/lib/bloodMatching";
import Skeleton, { StatsSkeleton } from "@/components/ui/Skeleton";
import { History, ArrowRight, Calendar, Droplets, RefreshCw, Lock, Activity } from "lucide-react";

export default function LabDashboard() {
    const [inventory, setInventory] = useState([]);
    const [camps, setCamps] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [inventoryRes, campsRes, logsRes] = await Promise.all([
                axios.get('/api/inventory'),
                axios.get('/api/camps'),
                axios.get('/api/logs')
            ]);
            setInventory(inventoryRes.data || []);
            setCamps(campsRes.data || []);
            setLogs(logsRes.data || []);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Get camp status based on date
    const getCampStatus = (dateStr) => {
        const campDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        campDate.setHours(0, 0, 0, 0);

        if (campDate < today) return { status: "Completed", color: "green" };
        if (campDate.getTime() === today.getTime()) return { status: "Ongoing", color: "gray" };
        return { status: "Upcoming", color: "yellow" };
    };

    // Format date for display
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    };

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
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Droplets className="w-5 h-5 text-gray-400" />
                                Blood Inventory
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">Current blood stock levels</p>
                        </div>
                        <button onClick={fetchData} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
                            </div>
                        ) : inventory.length > 0 ? (
                            inventory.slice(0, 8).map((item, index) => (
                                <InventoryRow key={item._id || index} type={item.bloodType} units={item.units || item.quantity || 0} />
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-sm italic">No inventory data available</div>
                        )}
                    </div>
                </div>

                {/* Recent Camps */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                Recent Blood Donation Camps
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">Latest organized camps</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
                        ) : camps.length > 0 ? (
                            camps.slice(0, 4).map((camp, index) => {
                                const { status, color } = getCampStatus(camp.date);
                                return (
                                    <CampRow
                                        key={camp._id || index}
                                        name={camp.name || camp.title}
                                        date={formatDate(camp.date)}
                                        status={status}
                                        donors={camp.donors || camp.targetDonors || 0}
                                        color={color}
                                    />
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-sm">No camps data</div>
                        )}
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
                    {loading ? (
                        <div className="text-center py-4 text-gray-400 text-xs">Loading history...</div>
                    ) : logs.filter(l => l.action === 'System Access').length > 0 ? (
                        logs.filter(l => l.action === 'System Access').slice(0, 5).map((log, i) => (
                            <LogEntry
                                key={log._id || i}
                                title={log.action}
                                detail={log.details}
                                date={new Date(log.createdAt).toLocaleString()}
                                icon="blue"
                            />
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-400 text-xs italic">No access history found</div>
                    )}
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
                    {loading ? (
                        <div className="text-center py-4 text-gray-400 text-xs">Loading activity...</div>
                    ) : logs.length > 0 ? (
                        logs.slice(0, 5).map((log, i) => (
                            <LogEntry
                                key={log._id || i}
                                title={log.action}
                                detail={log.details}
                                date={new Date(log.createdAt).toLocaleString()}
                                icon={log.icon || "blue"}
                            />
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-400 text-xs italic">No recent activity found</div>
                    )}
                </div>
            </div>
        </div>
    );
}



function InventoryRow({ type, units }) {
    const recipients = useMemo(() => getCompatibleRecipients(type), [type]);

    return (
        <div className="group relative flex items-center justify-between p-3.5 bg-gray-50/50 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm
                    ${type === 'O-' ? 'bg-red-600 text-white' :
                        type.includes('+') ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            'bg-purple-50 text-purple-600 border border-purple-100'}`}>
                    {type}
                </div>
                <div>
                    <span className="font-bold text-gray-900 block leading-tight">{units} units</span>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                        Can give to: <span className="text-gray-700 font-medium">{recipients.join(', ')}</span>
                    </p>
                </div>
            </div>

            {/* Compatibility info on hover or secondary label */}
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold 
                ${units < 10 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-100 text-gray-500'}`}>
                {units < 10 ? 'LOW STOCK' : 'ADEQUATE'}
            </div>
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
