import { Tent, Plus, Search, Calendar, MapPin, Users, Edit2, trash, Trash2 } from "lucide-react";

export default function LabCampsPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                            <DropletIcon className="w-6 h-6" />
                        </div>
                        Blood Donation Camps
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 ml-12">Manage and organize blood donation camps</p>
                </div>

                <button className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Camp
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <StatCard value="5" label="Total Camps" border="red" />
                <StatCard value="2" label="Upcoming" border="blue" />
                <StatCard value="2" label="Ongoing" border="green" />
                <StatCard value="1" label="Completed" border="gray" />
                <StatCard value="0" label="Cancelled" border="red" />
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search camps..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-red-500 text-sm"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                </div>
                <select className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 outline-none">
                    <option>All Status</option>
                    <option>Upcoming</option>
                    <option>Ongoing</option>
                    <option>Completed</option>
                </select>
                <select className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 outline-none">
                    <option>Sort by Date</option>
                    <option>Sort by Name</option>
                </select>
            </div>

            {/* Camps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CampCard
                    name="NMMC"
                    status="Ongoing"
                    date="11/30/2025"
                    time="13:33 - 14:34"
                    location="Panvel, mumbai, maharashatra - 400101"
                    expected="50"
                    statusColor="green"
                />
                <CampCard
                    name="hello"
                    status="Completed"
                    date="11/26/2025"
                    time="23:25 - 23:26"
                    location="center, MH, MH - 400701"
                    expected="50"
                    desc="come"
                    statusColor="gray"
                />
                <CampCard
                    name="pppppp"
                    status="Ongoing"
                    date="11/15/2025"
                    time="10:26 - 11:26"
                    location="wwwwwwwww, wwwwwwwww, wwwwwwww - 400123"
                    expected="50"
                    statusColor="green"
                />
                <CampCard
                    name="pokpo"
                    status="Upcoming"
                    date="11/14/2025"
                    time="12:10 - 13:10"
                    location="p, p, p - 400400"
                    expected="5"
                    statusColor="blue"
                />
                <CampCard
                    name="pokemon"
                    status="Upcoming"
                    date="11/12/2025"
                    time="18:55 - 20:52"
                    location="a, a, a - 400400"
                    expected="5"
                    desc="a"
                    statusColor="blue"
                />
            </div>
        </div>
    );
}

function StatCard({ value, label, border }) {
    const borders = {
        red: "border-l-red-500",
        blue: "border-l-blue-500",
        green: "border-l-green-500",
        gray: "border-l-gray-500",
    }
    return (
        <div className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm border-l-4 ${borders[border]}`}>
            <h3 className="text-xl font-bold text-gray-900">{value}</h3>
            <span className="text-xs text-gray-500 font-medium">{label}</span>
        </div>
    )
}

function CampCard({ name, status, date, time, location, expected, desc, statusColor }) {
    const colors = {
        green: "bg-green-100 text-green-700",
        blue: "bg-blue-100 text-blue-700",
        gray: "bg-gray-100 text-gray-600",
    }
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${colors[statusColor]}`}>
                        {status}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between text-xs text-gray-400 font-medium mb-3">
                    <span>{date}</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    <span className="text-xs">{time}</span>
                </div>
                <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                    <span className="text-xs leading-tight">{location}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-xs">Expected: {expected} donors</span>
                </div>
                {desc && (
                    <p className="text-xs text-gray-500 mt-2 italic pt-2 border-t border-gray-50">{desc}</p>
                )}
            </div>
        </div>
    )
}

function DropletIcon(props) {
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
