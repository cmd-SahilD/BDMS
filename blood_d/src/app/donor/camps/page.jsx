"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Tent, Search, Calendar, Clock, Users, RefreshCw, MapPin, Loader2 } from "lucide-react";

export default function CampsPage() {
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("Upcoming");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCamps = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/camps");
            setCamps(response.data || []);
        } catch (error) {
            console.error("Error fetching camps:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCamps();
    }, []);

    const filteredCamps = camps.filter(camp => {
        const matchesSearch = camp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            camp.location.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesFilter = true;
        if (filter === "Upcoming") matchesFilter = camp.status === "Upcoming";
        if (filter === "Ongoing") matchesFilter = camp.status === "Ongoing";
        // "All Camps" shows everything

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
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
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search camps, locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-500 bg-white"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 outline-none hover:border-red-500 transition-colors"
                >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="All">All Camps</option>
                </select>
                <button
                    onClick={fetchCamps}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            <div className="text-sm text-gray-500 font-medium ml-1">
                Showing {filteredCamps.length} camps.
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-red-600" />
                </div>
            ) : filteredCamps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCamps.map(camp => (
                        <CampCard
                            key={camp._id}
                            title={camp.name}
                            facility={camp.organizerName || "Organizer"}
                            location={camp.location}
                            date={new Date(camp.date).toLocaleDateString()}
                            time={`${camp.startTime} - ${camp.endTime}`}
                            capacity={`${camp.expectedDonors} Expected Donors`}
                            desc={camp.description || "No description provided."}
                            status={camp.status}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <Tent className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">No camps found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </div>
    );
}

function CampCard({ title, facility, location, date, time, capacity, desc, status }) {
    const statusClasses = {
        Upcoming: "bg-blue-100 text-blue-700",
        Ongoing: "bg-green-100 text-green-700",
        Completed: "bg-gray-100 text-gray-600",
        Cancelled: "bg-red-100 text-red-700"
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{title}</h3>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wide ${statusClasses[status] || "bg-gray-100"}`}>
                    {status}
                </span>
            </div>

            <div className="space-y-4 text-sm text-gray-600 flex-1">
                <div className="space-y-2">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        <span className="font-medium text-gray-700 line-clamp-2">{location}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs">{date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs">{time}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                    <div className="flex items-center justify-between text-xs mb-3">
                        <span className="flex items-center gap-2 text-gray-500">
                            <Users className="w-3.5 h-3.5" />
                            Capacity:
                        </span>
                        <span className="font-bold text-gray-900">{capacity}</span>
                    </div>

                    <div>
                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Description</h5>
                        <p className="text-xs text-gray-500 italic line-clamp-3">{desc}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
