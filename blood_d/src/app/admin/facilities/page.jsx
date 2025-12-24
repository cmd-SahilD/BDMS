"use client";
import { Search, Mail, ShieldCheck, MapPin, Building2,Plus, Phone, Clock, FileText, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function FacilitiesPage() {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('All Types');
    const [filterStatus, setFilterStatus] = useState('All Status');
    const [searchTerm, setSearchTerm] = useState('');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [formData, setFormData] = useState({
        facilityName: "",
        email: "",
        password: "",
        role: "hospital",
        phone: "",
        licenseNumber: "",
        address: {
            street: "",
            city: "",
            state: "",
            zip: ""
        }
    });

    const fetchFacilities = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/admin/facilities');
            setFacilities(res.data);
        } catch (error) {
            console.error("Failed to fetch facilities", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFacilities();
    }, []);

    const handleAddFacility = async (e) => {
        e.preventDefault();
        setAddLoading(true);
        try {
            await axios.post("/api/admin/facilities", formData);
            setIsAddModalOpen(false);
            fetchFacilities();
            setFormData({
                facilityName: "",
                email: "",
                password: "",
                role: "hospital",
                phone: "",
                licenseNumber: "",
                address: { street: "", city: "", state: "", zip: "" }
            });
            alert("Medical facility created successfully!");
        } catch (error) {
            console.error("Error creating facility:", error);
            alert(error.response?.data?.error || "Failed to create facility");
        } finally {
            setAddLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.put('/api/admin/facilities', { id, isVerified: status });
            // Optimistic update
            setFacilities(prev => prev.map(f =>
                f._id === id ? { ...f, isVerified: status } : f
            ));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        }
    };

    const filteredFacilities = facilities.filter(f => {
        const matchesSearch = f.facilityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'All Types' ||
            (filterType === 'Hospital' && f.role === 'hospital') ||
            (filterType === 'Blood Bank' && f.role === 'blood-bank');

        const matchesStatus = filterStatus === 'All Status' ||
            (filterStatus === 'Approved' && f.isVerified) ||
            (filterStatus === 'Pending' && !f.isVerified);

        return matchesSearch && matchesType && matchesStatus;
    });

    const stats = {
        total: facilities.length,
        approved: facilities.filter(f => f.isVerified).length,
        pending: facilities.filter(f => !f.isVerified).length,
        rejected: 0 // We don't have a 'rejected' state in boolean, assuming !isVerified is 'Pending/Unverified'
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Medical Facilities</h1>
                    </div>
                    <p className="text-gray-500 text-sm ml-11">Manage and view all registered hospitals and blood banks</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchFacilities}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors bg-white">
                        Refresh Data
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Facility
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center divide-x divide-gray-100">
                <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total Facilities</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Approved</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-orange-500">{stats.pending}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Pending</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-red-600">-</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Rejected</div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 flex-col md:flex-row">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search facilities by name, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 outline-none">
                    <option>All Types</option>
                    <option>Hospital</option>
                    <option>Blood Bank</option>
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 outline-none">
                    <option>All Status</option>
                    <option>Approved</option>
                    <option>Pending</option>
                </select>
            </div>

            {/* Facilities Grid */}
            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading facilities...</div>
            ) : filteredFacilities.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No facilities found.</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredFacilities.map((facility) => (
                        <FacilityCard
                            key={facility._id}
                            data={facility}
                            onUpdateStatus={handleUpdateStatus}
                        />
                    ))}
                </div>
            )}

            {/* Add Facility Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-red-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Add New Facility</h2>
                                <p className="text-gray-500 text-sm">Manually register a hospital or blood bank</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddFacility} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-tight text-[10px]">Facility Name</label>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={formData.facilityName}
                                        onChange={(e) => setFormData({...formData, facilityName: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-tight text-[10px]">Email Address</label>
                                    <input 
                                        type="email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-tight text-[10px]">Password</label>
                                    <input 
                                        type="password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-tight text-[10px]">Role</label>
                                    <select 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={formData.role}
                                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    >
                                        <option value="hospital">Hospital</option>
                                        <option value="blood-bank">Blood Bank</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-tight text-[10px]">License Number</label>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={formData.licenseNumber}
                                        onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-tight text-[10px]">Phone Number</label>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 grid grid-cols-4 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-tight text-[10px]">Street</label>
                                        <input 
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                            value={formData.address.street}
                                            onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-tight text-[10px]">City</label>
                                        <input 
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                            value={formData.address.city}
                                            onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-tight text-[10px]">Zip</label>
                                        <input 
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                            value={formData.address.zip}
                                            onChange={(e) => setFormData({...formData, address: {...formData.address, zip: e.target.value}})}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={addLoading}
                                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-100 transition-all"
                                >
                                    {addLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Create Facility Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function FacilityCard({ data, onUpdateStatus }) {
    const { _id, facilityName, email, role, licenseNumber, phone, isVerified, address } = data;

    // Address formatting
    const formattedAddress = address ? `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.zip || ''}` : 'No address provided';

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{facilityName || 'Unnamed Facility'}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Mail className="w-3.5 h-3.5" />
                        {email}
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                            <ShieldCheck className="w-3 h-3" />
                            Approved
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                            <Clock className="w-3 h-3" />
                            Pending
                        </span>
                    )}

                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold text-white capitalize
                        ${role === 'hospital' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                        {role === 'hospital' ? <Building2 className="w-3 h-3 mr-1" /> : null}
                        {role === 'blood-bank' ? 'Blood Bank' : role}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-4"><ShieldCheck className="w-4 h-4" /></span>
                    <span className="font-mono" title="License Number">{licenseNumber || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-4"><Phone className="w-4 h-4" /></span>
                    <span>{phone || 'N/A'}</span>
                </div>
            </div>

            <div className="flex items-start gap-2 pt-4 border-t border-gray-50 text-sm text-gray-500 mb-4">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{formattedAddress}</span>
            </div>

            {/* Action Buttons */}
            {!isVerified && (
                <div className="flex gap-3 mt-auto">
                    <button
                        onClick={() => onUpdateStatus(_id, true)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors">
                        <CheckCircle className="w-4 h-4" />
                        Approve
                    </button>
                    {/* Keep reject simplistic for now as just staying unverified or maybe implementing delete/reject status later */}
                    <button
                        onClick={() => alert('Reject functionality (delete/ban) to be implemented')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-lg text-sm font-bold transition-colors">
                        <XCircle className="w-4 h-4" />
                        Reject
                    </button>
                </div>
            )}
        </div>
    )
}
