import { Heart, Activity, Droplets, Trophy, Calendar, Download, Share2, UserPlus, Clock, Scale, CalendarCheck } from "lucide-react";
import Link from 'next/link';

export default function DonorDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Heart className="w-6 h-6 text-red-600 fill-red-600" />
                        <h1 className="text-2xl font-bold text-gray-900">Donor Dashboard</h1>
                    </div>
                    <p className="text-gray-500 text-sm">Track your donation journey and impact</p>
                </div>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 bg-white">
                    Refresh Data
                </button>
            </div>

            {/* Banner */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                    <Clock className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-yellow-800 text-sm">Next Donation Available</h4>
                    <p className="text-yellow-700 text-xs">You can donate again in 87 days</p>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Donor Profile</h3>
                        <div className="flex gap-6 mt-1 text-sm text-gray-500">
                            <div>
                                <span className="block text-[10px] uppercase tracking-wider text-gray-400">Email</span>
                                suruuuu@gmail.com
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase tracking-wider text-gray-400">Phone</span>
                                6666666666
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold">
                            <Droplets className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase tracking-wider text-gray-400">Blood Type</span>
                            <span className="font-bold text-gray-900">A+</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase tracking-wider text-gray-400">Location</span>
                            <span className="font-bold text-gray-900">Mumbai, Maharashtra</span>
                        </div>
                    </div>
                </div>

                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full whitespace-nowrap">
                    Not Eligible
                </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Total Donations"
                    value="1"
                    sub="5 to next milestone"
                    icon={Droplets}
                    color="red"
                />
                <StatCard
                    title="Lives Impacted"
                    value="3"
                    sub="3 lives per donation"
                    icon={Activity}
                    color="green"
                />
                <StatCard
                    title="Achievement Level"
                    value="Bronze"
                    sub="Keep donating to level up"
                    icon={Trophy}
                    color="purple"
                />
                <StatCard
                    title="Next Eligible"
                    value="2/25/2026"
                    sub="87 days left"
                    icon={Calendar}
                    color="blue"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity / Donation History */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-gray-400" />
                        Donation History
                    </h3>
                    <p className="text-gray-500 text-xs mb-6">Your blood donation journey</p>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                <Droplets className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">N/A</p>
                                <p className="text-gray-400 text-xs">11/27/2025 • A+</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-900 text-sm">1 unit</p>
                            <span className="text-green-600 text-xs font-medium">Completed</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity/Updates */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        Recent Activity
                    </h3>
                    <p className="text-gray-500 text-xs mb-6">Latest updates and achievements</p>

                    <div className="flex items-start justify-between">
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">Donation</h4>
                            <p className="text-gray-500 text-xs mt-1">Blood donation completed</p>
                        </div>
                        <span className="text-gray-400 text-xs">Invalid Date</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                    Quick Actions
                </h3>
                <p className="text-gray-500 text-xs mb-6 -mt-2">Manage your donor profile</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <QAction title="Download Certificate" sub="Get your donation certificate" icon={Download} color="blue" />
                    <QAction title="Share Achievement" sub="Share your impact with others" icon={Share2} color="green" />
                    <QAction title="Schedule Donation" sub="Book your next donation" icon={CalendarCheck} color="red" />
                    <QAction title="Invite Friends" sub="Grow the donor community" icon={UserPlus} color="purple" />
                </div>
            </div>

            {/* Health Overview */}
            <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-gray-400" />
                    Health Overview
                </h3>
                <p className="text-gray-500 text-xs mb-6 -mt-2">Your health metrics</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <HealthCard label="Age" value="21" icon={UserPlus} />
                    <HealthCard label="Weight" value="46 kg" icon={Scale} />
                    <HealthCard label="Last Donation" value="11/27/2025" icon={Calendar} />
                    <HealthCard label="Donor Since" value="2025" icon={Trophy} />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, sub, icon: Icon, color }) {
    const bgColors = {
        red: "bg-red-50 text-red-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        blue: "bg-blue-50 text-blue-600"
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
            <div>
                <span className="block text-gray-500 text-xs font-medium mb-1">{title}</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
                <span className="text-gray-400 text-[10px]">{sub}</span>
            </div>
            <div className={`p-3 rounded-xl ${bgColors[color]}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
    )
}

function QAction({ title, sub, icon: Icon, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
        green: "bg-green-50 text-green-600 hover:bg-green-100",
        red: "bg-red-50 text-red-600 hover:bg-red-100",
        purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    }
    return (
        <button className={`p-4 rounded-xl text-left transition-colors flex flex-col items-start gap-4 ${colors[color]}`}>
            <Icon className="w-6 h-6" />
            <div>
                <h4 className="font-bold text-sm mb-1">{title}</h4>
                <p className="text-[10px] opacity-80">{sub}</p>
            </div>
        </button>
    )
}

function HealthCard({ label, value, icon: Icon }) {
    return (
        <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
            <div>
                <span className="block text-gray-500 text-xs font-medium mb-1">{label}</span>
                <h3 className="text-xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className="p-2 bg-white rounded-lg shadow-sm text-red-400">
                <Icon className="w-4 h-4" />
            </div>
        </div>
    )
}

function ShieldCheckIcon(props) {
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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
