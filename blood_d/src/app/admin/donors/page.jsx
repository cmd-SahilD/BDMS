"use client";
import { Mail, User, Phone, Droplet, Calendar, Trash2, Edit2, X, Loader2, Plus, Check, MapPin } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import SearchInput from "@/components/ui/SearchInput";
import Pagination from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";

export default function DonorsPage() {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    // Edit Donor state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingDonor, setEditingDonor] = useState(null);
    const [editFormData, setEditFormData] = useState({
        age: "",
        weight: "",
        bloodType: ""
    });
    const [updateLoading, setUpdateLoading] = useState(false);

    const handleToggleVerification = async (donor) => {
        if (!confirm(`Are you sure you want to ${donor.isVerified ? 'unverify' : 'verify'} this donor?`)) return;
        try {
            const response = await axios.put('/api/admin/donors', {
                id: donor._id,
                isVerified: !donor.isVerified
            });
            setDonors(prev => prev.map(d => d._id === donor._id ? response.data : d));
        } catch (error) {
            console.error("Failed to update verification status", error);
            alert("Failed to update verification");
        }
    };

    const fetchDonors = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/admin/donors');
            setDonors(res.data);
        } catch (error) {
            console.error("Failed to fetch donors", error);
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
            fetchDonors();
            alert("Donation recorded successfully!");
        } catch (error) {
            console.error("Error adding donation:", error);
            alert("Failed to record donation");
        } finally {
            setAddLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this donor?")) return;
        try {
            await axios.delete(`/api/admin/donors?id=${id}`);
            setDonors(prev => prev.filter(d => d._id !== id));
        } catch (error) {
            console.error("Failed to delete donor", error);
            alert("Failed to delete donor");
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

    useEffect(() => {
        fetchDonors();
    }, []);

    const filteredDonors = useMemo(() => {
        return donors.filter(d => {
            return !searchTerm ||
                d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.bloodType?.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [donors, searchTerm]);

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);
    const paginatedDonors = filteredDonors.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                            <User className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Registered Donors</h1>
                    </div>
                    <p className="text-gray-500 text-sm ml-11">Manage all registered blood donors</p>
                </div>
                <button
                    onClick={fetchDonors}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors bg-white">
                    Refresh Data
                </button>
            </div>

            {/* Search */}
            <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search donors by name, email, or blood type..."
            />

            {/* Donors List */}
            {loading ? (
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <TableSkeleton rows={8} cols={5} />
                </div>
            ) : paginatedDonors.length === 0 ? (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
                    <User className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No donors found matching your search.</p>
                </div>
            ) : (
                <>
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Donor</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Blood Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Age / Weight</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Donation</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedDonors.map((donor) => (
                                    <tr key={donor._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">
                                                    {donor.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{donor.name}</p>
                                                    <p className="text-xs text-gray-500">ID: {donor._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {donor.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {donor.phone || 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    <span className="truncate max-w-[150px]" title={typeof donor.address === 'string' ? donor.address : donor.address?.street || 'N/A'}>
                                                        {typeof donor.address === 'string' ? donor.address : donor.address?.street || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Droplet className={`w-4 h-4 
                                                    ${['A+', 'A-'].includes(donor.bloodType) ? 'text-blue-500' :
                                                        ['B+', 'B-'].includes(donor.bloodType) ? 'text-red-500' :
                                                            ['O+', 'O-'].includes(donor.bloodType) ? 'text-purple-500' : 'text-orange-500'}
                                                `} />
                                                <span className="font-bold text-gray-900 text-sm">{donor.bloodType || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-600 space-y-0.5">
                                                <p><span className="font-semibold text-gray-700">Age:</span> {donor.age || 'N/A'}</p>
                                                <p><span className="font-semibold text-gray-700">Weight:</span> {donor.weight ? `${donor.weight} kg` : 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Never'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${donor.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {donor.isVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggleVerification(donor)}
                                                    className={`p-2 rounded-lg transition-colors ${donor.isVerified
                                                        ? 'text-yellow-600 hover:bg-yellow-50'
                                                        : 'text-green-600 hover:bg-green-50'
                                                        }`}
                                                    title={donor.isVerified ? "Revoke Verification" : "Approve Donor"}
                                                >
                                                    {donor.isVerified ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setAddingToDonor(donor);
                                                        setDonationFormData(prev => ({ ...prev, location: donor.address?.city || "Admin Portal" }));
                                                        setIsAddModalOpen(true);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Record Donation">
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(donor)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Metrics">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(donor._id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete User">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredDonors.length}
                        itemsPerPage={itemsPerPage}
                    />
                </>
            )}
            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Edit Donor Metrics</h2>
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
                                    onChange={(e) => setEditFormData({ ...editFormData, bloodType: e.target.value })}
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
                                        onChange={(e) => setEditFormData({ ...editFormData, weight: e.target.value })}
                                        min="45"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={editFormData.age}
                                        onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
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
                                <h2 className="text-xl font-bold text-gray-900">Manual Donation Entry</h2>
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
                                        onChange={(e) => setDonationFormData({ ...donationFormData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        value={donationFormData.units}
                                        onChange={(e) => setDonationFormData({ ...donationFormData, units: e.target.value })}
                                        min="1"
                                        max="5"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location / Facility</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="Enter facility or camp name"
                                    value={donationFormData.location}
                                    onChange={(e) => setDonationFormData({ ...donationFormData, location: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={donationFormData.status}
                                    onChange={(e) => setDonationFormData({ ...donationFormData, status: e.target.value })}
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
