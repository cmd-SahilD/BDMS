"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, Droplets, MapPin, Phone, Calendar, Loader2, History, X, Edit2, Plus } from "lucide-react";

export default function DonorsPage() {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBloodType, setFilterBloodType] = useState("");
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [donorHistory, setDonorHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    
    // Add Donation state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addingToDonor, setAddingToDonor] = useState(null);
    const [donationFormData, setDonationFormData] = useState({
        units: 1,
        date: new Date().toISOString().split('T')[0],
        location: "",
        status: "Completed"
    });
    const [addLoading, setAddLoading] = useState(false);

    useEffect(() => {
        fetchDonors();
    }, []);

    const fetchDonors = async () => {
        try {
            const response = await axios.get("/api/donors");
            setDonors(response.data.donors);
        } catch (error) {
            console.error("Error fetching donors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddDonation = async (e) => {
        e.preventDefault();
        setAddLoading(true);
        try {
            const payload = {
                ...donationFormData,
                donorId: addingToDonor._id,
                type: addingToDonor.bloodType
            };
            await axios.post("/api/donations", payload);
            setIsAddModalOpen(false);
            // Refresh donors to update lastDonationDate and eligibility
            fetchDonors();
            alert("Donation recorded successfully!");
        } catch (error) {
            console.error("Error adding donation:", error);
            alert("Failed to record donation");
        } finally {
            setAddLoading(false);
        }
    };

    const handleUpdateDonor = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const response = await axios.patch(`/api/users/${editingDonor._id}`, editFormData);
            setDonors(prev => prev.map(d => d._id === editingDonor._id ? response.data : d));
            setIsEditModalOpen(false);
            setEditingDonor(null);
        } catch (error) {
            console.error("Error updating donor:", error);
            alert("Failed to update donor info");
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleEditClick = (donor) => {
        setEditingDonor(donor);
        setEditFormData({
            age: donor.age || "",
            weight: donor.weight || "",
            bloodType: donor.bloodType || ""
        });
        setIsEditModalOpen(true);
    };

    const fetchDonorHistory = async (donorId) => {
        setHistoryLoading(true);
        try {
            const response = await axios.get(`/api/donations?donorId=${donorId}`);
            setDonorHistory(response.data.donations || []);
        } catch (error) {
            console.error("Error fetching donor history:", error);
            setDonorHistory([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    const checkEligibility = (lastDonationDate) => {
        if (!lastDonationDate) return { isEligible: true, daysRemaining: 0 };
        const cooldownDays = 90; // 3 months
        const lastDate = new Date(lastDonationDate);
        const today = new Date();
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays >= cooldownDays) {
            return { isEligible: true, daysRemaining: 0 };
        } else {
            return { isEligible: false, daysRemaining: cooldownDays - diffDays };
        }
    };

    const handleViewHistory = (donor) => {
        setSelectedDonor(donor);
        fetchDonorHistory(donor._id);
    };

    const closeHistoryModal = () => {
        setSelectedDonor(null);
        setDonorHistory([]);
    };

    const filteredDonors = donors.filter(donor => {
        const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donor.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterBloodType ? donor.bloodType === filterBloodType : true;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Registered Donors</h1>
                    <p className="text-gray-500 text-sm">Manage and view all registered blood donors</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search donors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-64"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                    <select
                        value={filterBloodType}
                        onChange={(e) => setFilterBloodType(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                    >
                        <option value="">All Blood Types</option>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDonors.map((donor) => (
                        <div key={donor._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold overflow-hidden">
                                        {donor.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 line-clamp-1">{donor.name}</h3>
                                        <div className="flex items-center gap-2">
                                             <p className="text-xs text-gray-500 line-clamp-1">{donor.email}</p>
                                             {(() => {
                                                 const { isEligible, daysRemaining } = checkEligibility(donor.lastDonationDate);
                                                 return isEligible ? (
                                                     <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">Eligible</span>
                                                 ) : (
                                                     <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full" title={`${daysRemaining} days left`}>Not Eligible</span>
                                                 );
                                             })()}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${donor.bloodType?.includes('O') ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                    {donor.bloodType}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>{donor.phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{donor.address?.street || 'No address'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Last Donation: {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Never'}</span>
                                </div>
                                <div className="flex gap-4 pt-1">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Weight: <span className="text-gray-900">{donor.weight || 'N/A'} kg</span></div>
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Age: <span className="text-gray-900">{donor.age || 'N/A'}</span></div>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleViewHistory(donor)}
                                    className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <History className="w-4 h-4" />
                                    History
                                </button>
                                <button 
                                    onClick={() => handleEditClick(donor)}
                                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
                                    title="Edit Metrics"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => {
                                        setAddingToDonor(donor);
                                        setDonationFormData(prev => ({ ...prev, location: donor.address?.city || "" }));
                                        setIsAddModalOpen(true);
                                    }}
                                    className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg text-sm font-medium flex items-center justify-center transition-colors shadow-sm border border-green-100"
                                    title="Add Donation Record"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {filteredDonors.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500">
                            No donors found matching your criteria.
                        </div>
                    )}
                </div>
            )}

            {/* History Modal */}
            {selectedDonor && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Donation History</h2>
                                <p className="text-gray-500 text-sm">For {selectedDonor.name} • {selectedDonor.bloodType}</p>
                            </div>
                            <button onClick={closeHistoryModal} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            {historyLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                                </div>
                            ) : donorHistory.length > 0 ? (
                                <div className="space-y-4">
                                     {donorHistory.map((donation) => (
                                        <div key={donation._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-4">
                                                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-600 shadow-sm border border-gray-100">
                                                    <Droplets className="w-5 h-5" />
                                                 </div>
                                                 <div>
                                                     <p className="font-bold text-gray-900">{new Date(donation.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                     <p className="text-xs text-gray-500">{donation.location}</p>
                                                 </div>
                                            </div>
                                            <div className="text-right">
                                                 <span className="block font-bold text-gray-900">{donation.units} Unit{donation.units !== 1 && 's'}</span>
                                                 <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase">{donation.status}</span>
                                            </div>
                                        </div>
                                     ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No donation history found for this donor.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Update Donor Info</h2>
                                <p className="text-gray-500 text-sm">Managing health metrics for {editingDonor?.name}</p>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdateDonor} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                                <select 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                    value={editFormData.bloodType}
                                    onChange={(e) => setEditFormData({...editFormData, bloodType: e.target.value})}
                                >
                                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                    <input 
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={editFormData.weight}
                                        onChange={(e) => setEditFormData({...editFormData, weight: e.target.value})}
                                        min="45"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                    <input 
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={editFormData.age}
                                        onChange={(e) => setEditFormData({...editFormData, age: e.target.value})}
                                        min="18"
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={updateLoading}
                                    className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {updateLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Add Donation Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-green-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Add Donation Record</h2>
                                <p className="text-gray-500 text-sm">Recording for {addingToDonor?.name} ({addingToDonor?.bloodType})</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddDonation} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input 
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        value={donationFormData.date}
                                        onChange={(e) => setDonationFormData({...donationFormData, date: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
                                    <input 
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        value={donationFormData.units}
                                        onChange={(e) => setDonationFormData({...donationFormData, units: e.target.value})}
                                        min="1"
                                        max="5"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location / Camp Name</label>
                                <input 
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="Enter facility or camp name"
                                    value={donationFormData.location}
                                    onChange={(e) => setDonationFormData({...donationFormData, location: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={donationFormData.status}
                                    onChange={(e) => setDonationFormData({...donationFormData, status: e.target.value})}
                                >
                                    <option value="Completed">Completed</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={addLoading}
                                    className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {addLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
