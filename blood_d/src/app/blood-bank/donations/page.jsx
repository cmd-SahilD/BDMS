"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Droplets, Calendar, Loader2, History, User } from "lucide-react";

export default function GlobalHistoryPage() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchAllDonations = async () => {
            try {
                const response = await axios.get("/api/donations");
                setDonations(response.data.donations || []);
            } catch (error) {
                console.error("Error fetching global history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllDonations();
    }, []);

    const filteredDonations = donations.filter(donation => {
        const donorName = donation.donorId?.name || "";
        return donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               donation.location.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <History className="w-8 h-8 text-red-600" />
                        Global <span className="text-red-600">Donation History</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Review all historical donation records across the system</p>
                </div>
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search by donor name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none shadow-sm"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                </div>
            ) : filteredDonations.length > 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Donor</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Units</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredDonations.map((donation) => (
                                <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-xs uppercase">
                                                {donation.donorId?.name?.charAt(0) || <User className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{donation.donorId?.name || 'Unknown Donor'}</p>
                                                <p className="text-[10px] text-gray-500 font-semibold uppercase">{donation.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-gray-700">{donation.location}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {new Date(donation.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Droplets className="w-4 h-4 text-red-500" />
                                            <span className="font-bold text-gray-900 text-sm">{donation.units} Unit{donation.units !== 1 && 's'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                            donation.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                            donation.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {donation.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm">
                    <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No donation records found</h3>
                    <p className="text-sm">We couldn't find any donation entries matching your search criteria.</p>
                </div>
            )}
        </div>
    );
}
