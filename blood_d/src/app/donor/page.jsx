"use client";
import { Heart, Activity, Droplets, Trophy, Calendar, Download, Share2, UserPlus, Clock, Scale, CalendarCheck } from "lucide-react";
import Link from 'next/link';
import { useState, useEffect } from "react";

export default function DonorDashboard() {
    const [user, setUser] = useState(null);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await axios.get("/api/donations");
            setDonations(response.data.donations || []);
        } catch (error) {
            console.error("Error fetching donor donations:", error);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        totalDonations: donations.length,
        livesImpacted: donations.length * 3,
        lastDonationDate: donations.length > 0 ? new Date(donations[0].date) : null,
    };

    const getEligibility = () => {
        if (!stats.lastDonationDate) return { canDonate: true, daysLeft: 0 };
        const cooldown = 90;
        const diff = Math.ceil((new Date() - stats.lastDonationDate) / (1000 * 60 * 60 * 24));
        return { 
            canDonate: diff >= cooldown, 
            daysLeft: Math.max(0, cooldown - diff),
            nextDate: new Date(stats.lastDonationDate.getTime() + cooldown * 24 * 60 * 60 * 1000).toLocaleDateString()
        };
    };

    const eligibility = getEligibility();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Heart className="w-6 h-6 text-red-600 fill-red-600" />
                        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name || 'Donor'}</h1>
                    </div>
                    <p className="text-gray-500 text-sm">Track your donation journey and impact</p>
                </div>
            </div>

            {/* Banner */}
            {!eligibility.canDonate && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-yellow-800 text-sm">Next Donation Available</h4>
                        <p className="text-yellow-700 text-xs">You can donate again in {eligibility.daysLeft} days ({eligibility.nextDate})</p>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Total Donations"
                    value={stats.totalDonations}
                    sub={`${5 - (stats.totalDonations % 5)} to next milestone`}
                    icon={Droplets}
                    color="red"
                />
                <StatCard
                    title="Lives Impacted"
                    value={stats.livesImpacted}
                    sub="3 lives per donation"
                    icon={Activity}
                    color="green"
                />
                <StatCard
                    title="Achievement Level"
                    value={stats.totalDonations >= 10 ? "Gold" : stats.totalDonations >= 5 ? "Silver" : "Bronze"}
                    sub="Keep donating to level up"
                    icon={Trophy}
                    color="purple"
                />
                <StatCard
                    title="Next Eligible"
                    value={eligibility.canDonate ? "Ready now" : eligibility.nextDate}
                    sub={eligibility.canDonate ? "Visit a camp today" : `${eligibility.daysLeft} days left`}
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

                    <div className="space-y-3">
                        {loading ? (
                            <div className="flex justify-center py-4"><Loader2 className="animate-spin text-red-500" /></div>
                        ) : donations.length > 0 ? (
                            donations.slice(0, 3).map(donation => (
                                <div key={donation._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                            <Droplets className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{donation.location}</p>
                                            <p className="text-gray-400 text-xs">{new Date(donation.date).toLocaleDateString()} • {donation.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900 text-sm">{donation.units} unit{donation.units > 1 ? 's' : ''}</p>
                                        <span className="text-green-600 text-xs font-medium uppercase tracking-tighter">{donation.status}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-sm">No donation records yet</div>
                        )}
                    </div>
                </div>

                {/* Recent Activity/Updates */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center min-h-[200px]">
                    <Clock className="w-12 h-12 text-gray-200 mb-4" />
                    <h3 className="font-bold text-gray-800 mb-2">Automated Tracking</h3>
                    <p className="text-gray-500 text-xs px-4">Your donation records are automatically synced when a Blood Bank logs your contribution.</p>
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
                    <HealthCard label="Age" value={user?.age || "N/A"} icon={UserPlus} />
                    <HealthCard label="Weight" value={user?.weight ? `${user.weight} kg` : "N/A"} icon={Scale} />
                    <HealthCard label="Last Donation" value={stats.lastDonationDate ? stats.lastDonationDate.toLocaleDateString() : "Never"} icon={Calendar} />
                    <HealthCard label="Donor Since" value={user?.createdAt ? new Date(user.createdAt).getFullYear() : "2025"} icon={Trophy} />
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
