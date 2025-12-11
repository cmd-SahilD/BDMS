import { History, Share2, Download, TrendingUp, Droplets, Heart } from "lucide-react";

export default function HistoryPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                            <History className="w-5 h-5" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Your <span className="text-red-600">Donation Journey</span></h1>
                    </div>
                    <p className="text-gray-500 text-sm">Track your life-saving contributions and see the impact you're making</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Donations" value="1" icon={Droplets} color="red" />
                <StatCard title="Units Donated" value="1" icon={TrendingUp} color="green" />
                <StatCard title="Lives Impacted" value="3+" icon={Heart} color="blue" />
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="block text-gray-500 text-xs font-medium mb-1">Your Level</span>
                        <h3 className="text-2xl font-black text-gray-900">Starter</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <Heart className="w-5 h-5 fill-white" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search by facility, city, or blood group..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-red-500"
                    />
                    <History className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                        All Time
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </button>
                    <button className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                        Newest First
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </button>
                    <button className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            <div className="text-sm text-gray-500 font-medium ml-1">Showing 1 donation</div>

            {/* Donation List */}
            <div className="space-y-4">
                <DonationCard
                    date="Thu, 27 Nov, 2025"
                    location="Mumbai, Maharashtra"
                    type="A+ Donation"
                    status="Completed"
                    tag="Recent"
                    units="1"
                />
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
    const borders = {
        red: "border-l-4 border-l-red-500",
        green: "border-l-4 border-l-green-500",
        blue: "border-l-4 border-l-blue-500",
    };
    const colors = {
        red: "bg-red-50 text-red-600",
        green: "bg-green-50 text-green-600",
        blue: "bg-blue-50 text-blue-600",
    };

    return (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 ${borders[color]} flex items-center justify-between`}>
            <div>
                <span className="block text-gray-500 text-xs font-medium mb-1">{title}</span>
                <h3 className="text-3xl font-black text-gray-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${colors[color]}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
    )
}

function DonationCard({ date, location, type, status, tag, units }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow group">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0 group-hover:bg-green-100 transition-colors">
                    <Droplets className="w-6 h-6" />
                </div>
                <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-bold text-gray-900">{type}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide">{status}</span>
                        {tag && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wide">{tag}</span>}
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <History className="w-3.5 h-3.5" />
                            {date}
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5" />
                            {location}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-end justify-center pl-6 md:border-l border-gray-100">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-red-200">
                    +{units}
                </div>
                <span className="text-[10px] text-gray-400 font-medium mt-1 uppercase">Units</span>
            </div>
        </div>
    )
}
