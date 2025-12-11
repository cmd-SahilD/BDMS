"use client";
import { Search, Mail, User, Phone, Droplet, Calendar, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function DonorsPage() {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    useEffect(() => {
        fetchDonors();
    }, []);

    const filteredDonors = donors.filter(d => {
        return d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.bloodType?.toLowerCase().includes(searchTerm.toLowerCase());
    });

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
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search donors by name, email, or blood type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>

            {/* Donors List */}
            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading donors...</div>
            ) : filteredDonors.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No donors found.</div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Donor</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Blood Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Donation</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredDonors.map((donor) => (
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
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Never'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(donor._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete User">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
