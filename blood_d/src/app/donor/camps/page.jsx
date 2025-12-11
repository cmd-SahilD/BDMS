import { Tent, Search, Calendar, Clock, Users, RefreshCw } from "lucide-react";

export default function CampsPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                        <Tent className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Blood Donation Camps</h1>
                </div>
                <p className="text-gray-500 text-sm ml-13">Find local opportunities to donate blood and save lives.</p>
            </div>

            {/* Search Filter */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search camps, locations, hospital name..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-500 bg-white"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
                <select className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 outline-none">
                    <option>All Camps</option>
                    <option>Upcoming</option>
                    <option>Ongoing</option>
                </select>
                <button className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            <div className="text-sm text-gray-500 font-medium ml-1">Showing 5 camps. Total found: 5.</div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CampCard
                    title="pokemon"
                    facility="Associated Facility Missing"
                    location="a, a, a - 400400"
                    date="Nov 12, 2025"
                    time="18:55 - 20:52"
                    capacity="5 Expected Donors"
                    need="5 slots remaining"
                    desc="a"
                    status="Upcoming"
                />
                <CampCard
                    title="pokpo"
                    facility="Associated Facility Missing"
                    location="p, p, p - 400400"
                    date="Nov 14, 2025"
                    time="12:10 - 13:10"
                    capacity="5 Expected Donors"
                    need="5 slots remaining"
                    desc="No detailed description provided for this camp."
                    status="Upcoming"
                />
                <CampCard
                    title="pppppp"
                    facility="Associated Facility Missing"
                    location="wwwwwwwww, wwwwwwwww, wwwwwwww - 400123"
                    date="Nov 15, 2025"
                    time="10:26 - 11:26"
                    capacity="0 Achieved / 50 Expected"
                    need="50 slots remaining"
                    desc="No detailed description provided for this camp."
                    status="Ongoing"
                />
                <CampCard
                    title="hello"
                    facility="Associated Facility Missing"
                    location="center, MH, MH - 400701"
                    date="Nov 26, 2025"
                    time="23:25 - 23:26"
                    capacity="0 Achieved / 50 Expected"
                    desc="come"
                    status="Completed"
                    statusColor="gray"
                />
                <CampCard
                    title="NMMC"
                    facility="Associated Facility Missing"
                    location="Panvel, mumbai, maharashatra - 400101"
                    date="Nov 30, 2025"
                    time="13:33 - 14:34"
                    capacity="0 Achieved / 50 Expected"
                    need="50 slots remaining"
                    desc="No detailed description provided for this camp."
                    status="Ongoing"
                />
            </div>
        </div>
    );
}

function CampCard({ title, facility, location, date, time, capacity, need, desc, status, statusColor = "green" }) {
    const statusClasses = {
        green: "bg-green-100 text-green-700",
        gray: "bg-gray-100 text-gray-600",
    }
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wide ${statusClasses[statusColor]}`}>
                    {status}
                </span>
            </div>

            <div className="space-y-3 text-sm text-gray-600 flex-1">
                <div className="flex items-start gap-3">
                    <Tent className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="font-medium text-gray-700">{facility}</span>
                </div>
                <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-red-500 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    <span>{location}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">{date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">{time}</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 text-gray-500"><Users className="w-3.5 h-3.5" /> Capacity:</span>
                        <span className="font-medium">{capacity}</span>
                    </div>
                    {need && (
                        <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2 text-red-500"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg> Remaining Need:</span>
                            <span className="font-bold text-green-600">{need}</span>
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <h5 className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        Description
                    </h5>
                    <p className="text-xs text-gray-500 italic">{desc}</p>
                </div>
            </div>
        </div>
    )
}
