"use client";
import { Users, Building2, Ticket, Tent, RefreshCw, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        donors: 0,
        facilities: 0,
        donations: 0,
        camps: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/admin/stats');
            setStats(res.data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Comprehensive overview of the blood bank management system</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors bg-white">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Data
                </button>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard value={stats.donors} label="Donors" color="text-red-500" />
                <StatCard value={stats.facilities} label="Facilities" color="text-blue-500" />
                <StatCard value={stats.donations} label="Blood Units" color="text-green-500" />
                <StatCard value={stats.camps} label="Camps" color="text-purple-500" />
            </div>

            {/* System Overview */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-red-500 rounded-full"></span>
                    System Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <OverviewCard title="Total Donors" value={stats.donors} subtitle="Registered blood donors" icon={Users} color="red" />
                    <OverviewCard title="Facilities" value={stats.facilities} subtitle="Hospitals & Labs" icon={Building2} color="blue" />
                    <OverviewCard title="Total Units" value={stats.donations} subtitle="Blood units collected" icon={Ticket} color="green" />
                    <OverviewCard title="Upcoming Camps" value={stats.camps} subtitle="Scheduled blood drives" icon={Tent} color="purple" />
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-red-500 rounded-full"></span>
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ActionCard title="Manage Donors" desc="View, edit, or remove donors from the system" action="Manage" icon={Users} href="/admin/donors" />
                    <ActionCard title="Manage Facilities" desc="Approve, edit, or manage hospitals and labs" action="Manage" icon={Building2} href="/admin/facilities" />
                    <ActionCard title="Donation History" desc="View all donation records, analytics, and reports" action="Manage" icon={Ticket} href="/admin/donations" />
                    <ActionCard title="Blood Camps" desc="Monitor and manage upcoming blood donation camps" action="View Camps" icon={Tent} href="/admin/camps" />
                </div>
            </div>
        </div>
    );
}

function StatCard({ value, label, color }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <span className={`text-3xl font-black mb-1 ${color}`}>{value}</span>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        </div>
    )
}

function OverviewCard({ title, value, subtitle, icon: Icon, color }) {
    const colorClasses = {
        red: "bg-red-50 text-red-600",
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
    };

    return (
        <div className={`bg-white p-6 rounded-2xl border-l-4 shadow-sm flex items-start justify-between
            ${color === 'red' ? 'border-red-500' :
                color === 'blue' ? 'border-blue-500' :
                    color === 'green' ? 'border-green-500' : 'border-purple-500'}`}>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h4 className="text-3xl font-bold text-gray-900 mb-1">{value}</h4>
                <p className="text-xs text-gray-400">{subtitle}</p>
            </div>
            <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    )
}

function ActionCard({ title, desc, action, icon: Icon, href }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4`}>
                <Icon className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed h-10">{desc}</p>
            <Link href={href} className="flex items-center justify-center w-full py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors group">
                {action}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
        </div>
    )
}
