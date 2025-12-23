'use client';

import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, XCircle, Clock } from "lucide-react"; // Added Clock for pending
import axios from 'axios';

export default function LabRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) setUser(storedUser);

        if (storedUser) {
            fetchRequests(storedUser._id);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchRequests = async (providerId) => {
        try {
            const response = await axios.get(`/api/requests?providerId=${providerId}`);
            setRequests(response.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put('/api/requests', {
                id,
                status: newStatus
            });
            // Refresh requests or update local state
            fetchRequests(user._id);
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'Pending').length,
        accepted: requests.filter(r => r.status === 'Accepted').length,
        rejected: requests.filter(r => r.status === 'Rejected').length
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg text-red-600">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    Blood Requests
                </h1>
                <p className="text-gray-500 text-sm mt-1 ml-14">Manage blood requests from hospitals</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard value={stats.total} label="Total Requests" border="red" />
                <StatCard value={stats.pending} label="Pending" border="yellow" />
                <StatCard value={stats.accepted} label="Accepted" border="green" />
                <StatCard value={stats.rejected} label="Rejected" border="red" />
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Hospital</th>
                                <th className="px-6 py-4 font-semibold">Blood Type</th>
                                <th className="px-6 py-4 font-semibold">Units</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-4 text-center">Loading...</td></tr>
                            ) : requests.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-4 text-center">No requests found</td></tr>
                            ) : (
                                requests.map(request => (
                                    <RequestRow
                                        key={request._id}
                                        request={request}
                                        onStatusUpdate={handleStatusUpdate}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ value, label, border }) {
    const borders = {
        red: "border-l-red-500",
        yellow: "border-l-yellow-500",
        green: "border-l-green-500",
    }
    return (
        <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 ${borders[border]}`}>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
            <span className="text-gray-500 text-sm font-medium">{label}</span>
        </div>
    )
}

function RequestRow({ request, onStatusUpdate }) {
    const { requesterId, bloodType, units, status, createdAt, processedDate } = request;
    const hospitalName = requesterId?.facilityName || requesterId?.name || 'Unknown Hospital';
    const location = requesterId?.address?.city || 'Unknown Location'; // Assuming city is populated

    const date = new Date(createdAt).toLocaleDateString();
    const time = new Date(createdAt).toLocaleTimeString();
    const processed = processedDate ? new Date(processedDate).toLocaleDateString() : '-';

    return (
        <tr className="hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                        {hospitalName.charAt(0)}
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 text-sm">{hospitalName}</div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1">
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            {location}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${bloodType.includes('A') ? 'bg-red-100 text-red-700' : 'bg-red-50 text-red-700'}`}>
                    {bloodType}
                </span>
            </td>
            <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                {units} <span className="text-gray-400 font-normal text-xs">units</span>
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border 
                    ${status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-100' :
                        status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                            'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                    {status === 'Accepted' ? <CheckCircle2 className="w-3 h-3" /> :
                        status === 'Rejected' ? <XCircle className="w-3 h-3" /> :
                            <Clock className="w-3 h-3" />}
                    {status}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="text-xs font-bold text-gray-700">{date}</div>
                <div className="text-[10px] text-gray-400">{time}</div>
            </td>
            <td className="px-6 py-4 text-xs">
                {status === 'Pending' ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onStatusUpdate(request._id, 'Accepted')}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-md text-xs font-bold transition-colors"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => onStatusUpdate(request._id, 'Rejected')}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-xs font-bold transition-colors"
                        >
                            Reject
                        </button>
                    </div>
                ) : (
                    <span className="text-gray-500">
                        {status === 'Accepted' ? 'Accepted' : 'Rejected'} on {processed}
                    </span>
                )}
            </td>
        </tr>
    )
}
