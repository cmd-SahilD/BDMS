import { Users, Heart, Droplets, Calendar, Search, Mail, Phone, MapPin } from "lucide-react";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Donation from "@/models/Donation";

export default async function HospitalDonorsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    let user = null;
    let donors = [];
    let stats = {
        totalDonors: 0,
        activeDonors: 0,
        bloodTypes: {}
    };

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change");
            const { payload } = await jwtVerify(token, secret);

            await connectToDatabase();
            user = await User.findById(payload.userId);
            
            if (user) {
                // Fetch all donors (users with role 'donor')
                donors = await User.find({ role: 'donor' })
                    .select('name email phone bloodType lastDonationDate createdAt address')
                    .sort({ createdAt: -1 })
                    .limit(50);
                
                stats.totalDonors = donors.length;
                
                // Count donors who donated in the last 6 months as "active"
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                stats.activeDonors = donors.filter(d => d.lastDonationDate && new Date(d.lastDonationDate) > sixMonthsAgo).length;
                
                // Count blood types
                donors.forEach(d => {
                    if (d.bloodType) {
                        stats.bloodTypes[d.bloodType] = (stats.bloodTypes[d.bloodType] || 0) + 1;
                    }
                });
            }
        } catch (error) {
            console.error("Donors Fetch Error:", error.message);
        }
    }

    if (!user) {
        return <div className="p-12 text-center text-gray-500 font-medium">Please login to view donors.</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                            <Users className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Registered Donors</h1>
                    </div>
                    <p className="text-gray-500 text-sm ml-13">View all registered blood donors in the system</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard value={stats.totalDonors} label="Total Donors" icon={Users} color="blue" />
                <StatCard value={stats.activeDonors} label="Active Donors" icon={Heart} color="red" />
                <StatCard value={Object.keys(stats.bloodTypes).length} label="Blood Types" icon={Droplets} color="green" />
                <StatCard value={donors.filter(d => !d.lastDonationDate).length} label="New Donors" icon={Calendar} color="purple" />
            </div>

            {/* Blood Type Distribution */}
            {Object.keys(stats.bloodTypes).length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-red-500" />
                        Blood Type Distribution
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(stats.bloodTypes).map(([type, count]) => (
                            <div key={type} className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2">
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${type.includes('O') ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                                    {type}
                                </span>
                                <span className="text-sm font-bold text-gray-900">{count} donors</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Donors List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Users className="w-5 h-5 text-red-500" />
                        All Donors
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Registered blood donors ({donors.length})</p>
                </div>

                {donors.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {donors.map((donor) => (
                            <DonorRow 
                                key={donor._id} 
                                name={donor.name}
                                email={donor.email}
                                phone={donor.phone || "N/A"}
                                bloodType={donor.bloodType || "Unknown"}
                                lastDonation={donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : "Never"}
                                joinedDate={new Date(donor.createdAt).toLocaleDateString()}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-gray-300" />
                        </div>
                        <h4 className="font-bold text-gray-700 mb-2">No Donors Found</h4>
                        <p className="text-gray-500 text-sm">There are no registered donors in the system yet.</p>
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
        red: "text-red-500 bg-red-50",
        purple: "text-purple-500 bg-purple-50",
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

function DonorRow({ name, email, phone, bloodType, lastDonation, joinedDate }) {
    return (
        <div className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg uppercase">
                    {name?.charAt(0) || '?'}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">{name}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {email}
                        </span>
                        <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {phone}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-center">
                    <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs mx-auto mb-1 ${bloodType.includes('O') ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                        {bloodType}
                    </span>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wide">Blood Type</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-gray-700">{lastDonation}</p>
                    <p className="text-[10px] text-gray-400">Last Donation</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-mono text-gray-700">{joinedDate}</p>
                    <p className="text-[10px] text-gray-400">Joined</p>
                </div>
            </div>
        </div>
    );
}
