"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Tent, Calendar, Clock, MapPin, Users, Loader2, Trash2, Plus, Info, X } from "lucide-react";

export default function AdminCampsPage() {
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
        if (!confirm("Are you sure you want to delete this blood camp? This action cannot be undone.")) return;
        try {
            await axios.delete(`/api/camps?id=${id}`);
            setCamps(prev => prev.filter(c => c._id !== id));
            alert("Camp deleted successfully");
        } catch (error) {
            console.error("Error deleting camp:", error);
            alert("Failed to delete camp");
        }
    };

    const filteredCamps = camps.filter(camp => 
        camp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camp.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Tent className="w-8 h-8 text-red-600" />
                        Blood <span className="text-red-600">Donation Camps</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Oversee and manage all scheduled blood drives across the system</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative w-72 md:w-96">
                        <input
                            type="text"
                            placeholder="Search camps by name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none shadow-sm"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                    </div>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Camp
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                </div>
            ) : filteredCamps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCamps.map((camp) => (
                        <div key={camp._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
                            <div className="p-5 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                        camp.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                        camp.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {camp.status}
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteCamp(camp._id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Camp"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors uppercase">{camp.name}</h3>
                                
                                <div className="space-y-2.5 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>{new Date(camp.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>{camp.startTime} - {camp.endTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="line-clamp-1">{camp.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span>Expected Donors: <strong>{camp.expectedDonors}</strong></span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-5 py-4 bg-gray-50 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                        ID
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-mono">...{camp._id.slice(-6)}</span>
                                </div>
                                <button className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 uppercase tracking-tight">
                                    <Info className="w-3 h-3" />
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm">
                    <Tent className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No blood camps found</h3>
                    <p className="text-sm">There are no camps matching your search or no camps scheduled yet.</p>
                </div>
            )}

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-red-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Schedule New Camp</h2>
                                <p className="text-gray-500 text-sm">Organize a system-wide blood donation drive</p>
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
