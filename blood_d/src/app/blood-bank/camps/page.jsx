"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Tent, Plus, Search, Calendar, MapPin, Users, Edit2, Trash2, Loader2, X, Clock, Info } from "lucide-react";

export default function BBCampsPage() {
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        expectedDonors: 50,
        description: ""
    });

    useEffect(() => {
        fetchCamps();
    }, []);

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

    const handleAddCamp = async (e) => {
        e.preventDefault();
        setAddLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            await axios.post("/api/camps", { ...formData, organizerId: user?._id });
            setIsAddModalOpen(false);
            fetchCamps();
            setFormData({ name: "", date: "", startTime: "", endTime: "", location: "", expectedDonors: 50, description: "" });
            alert("Blood camp scheduled successfully!");
        } catch (error) {
            console.error("Error creating camp:", error);
            alert("Failed to schedule camp");
        } finally {
            setAddLoading(false);
        }
    };

    const handleDeleteCamp = async (id) => {
        if (!confirm("Are you sure you want to delete this camp?")) return;
        try {
            await axios.delete(`/api/camps?id=${id}`);
            setCamps(prev => prev.filter(c => c._id !== id));
        } catch (error) {
            console.error("Error deleting camp:", error);
            alert("Failed to delete camp");
        }
    };

    const filteredCamps = camps.filter(camp => 
        camp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camp.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: camps.length,
        upcoming: camps.filter(c => c.status === "Upcoming").length,
        ongoing: camps.filter(c => c.status === "Ongoing").length,
        completed: camps.filter(c => c.status === "Completed").length,
        cancelled: camps.filter(c => c.status === "Cancelled").length
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                            <Tent className="w-6 h-6" />
                        </div>
                        Blood Donation Camps
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage and organize blood donation drives</p>
                </div>

                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Camp
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard value={stats.total} label="Total Camps" border="red" />
                <StatCard value={stats.upcoming} label="Upcoming" border="blue" />
                <StatCard value={stats.ongoing} label="Ongoing" border="green" />
                <StatCard value={stats.completed} label="Completed" border="gray" />
                <StatCard value={stats.cancelled} label="Cancelled" border="red" />
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search camps by name or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-red-500 text-sm"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                </div>
            </div>

            {/* Camps Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                </div>
            ) : filteredCamps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCamps.map((camp) => (
                        <div key={camp._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg uppercase truncate max-w-[180px]">{camp.name}</h3>
                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                                        camp.status === 'Completed' ? 'bg-gray-100 text-gray-600' :
                                        camp.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 
                                        camp.status === 'Ongoing' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {camp.status}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleDeleteCamp(camp._id)}
                                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                                    <span>{new Date(camp.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-red-500" />
                                    <span className="text-xs">{camp.startTime} - {camp.endTime}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                                    <span className="text-xs leading-tight line-clamp-2">{camp.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-3.5 h-3.5 text-red-500" />
                                    <span className="text-xs font-bold">Expected: {camp.expectedDonors}</span>
                                </div>
                                {camp.description && (
                                    <p className="text-[10px] text-gray-500 mt-2 italic pt-2 border-t border-gray-50 line-clamp-2">{camp.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                    <Tent className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">No camps scheduled</h3>
                    <p className="text-gray-500 text-sm">Click "Add Camp" to organize a blood donation drive.</p>
                </div>
            )}

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-red-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Schedule New Camp</h2>
                                <p className="text-gray-500 text-sm">Organize a blood donation drive</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-red-100 rounded-full text-red-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddCamp} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Camp Name</label>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                                    <input 
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expected Donors</label>
                                    <input 
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={formData.expectedDonors}
                                        onChange={(e) => setFormData({...formData, expectedDonors: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Time</label>
                                    <input 
                                        type="time"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">End Time</label>
                                    <input 
                                        type="time"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="Full address of the camp"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (Optional)</label>
                                    <textarea 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none h-20"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={addLoading}
                                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-100 transition-all"
                                >
                                    {addLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Schedule Camp
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
