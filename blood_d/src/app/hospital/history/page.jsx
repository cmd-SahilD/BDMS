'use client';

import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";
import axios from 'axios';

export default function HistoryPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser) {
                setLoading(false);
                return;
            }

            try {
                // Fetch requests made BY this user (requesterId)
                const response = await axios.get(`/api/requests?requesterId=${storedUser._id}`);
                setRequests(response.data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'Pending').length,
        accepted: requests.filter(r => r.status === 'Accepted').length,
        rejected: requests.filter(r => r.status === 'Rejected').length
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-100 text-red-600 mb-4">
                    <Calendar className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Request History</h1>
                <p className="text-gray-500 text-sm mt-1">Track your blood request status and history</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard value={stats.total} label="Total Requests" color="green" />
                <StatCard value={stats.pending} label="Pending" color="yellow" />
                <StatCard value={stats.accepted} label="Accepted" color="green" />
                <StatCard value={stats.rejected} label="Rejected" color="red" />
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Blood Lab</th>
                                <th className="px-6 py-4 font-semibold">Blood Type</th>
                                <th className="px-6 py-4 font-semibold">Units</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Request Date</th>
                                <th className="px-6 py-4 font-semibold">Processed Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-4 text-center">Loading...</td></tr>
                            ) : requests.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-4 text-center">No request history found</td></tr>
                            ) : (
                                requests.map(req => (
                                    <TableRow
                                        key={req._id}
                                        request={req}
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

function StatCard({ value, label, color }) {
    const borders = {
        green: "border-l-4 border-l-green-500",
        yellow: "border-l-4 border-l-yellow-500",
        red: "border-l-4 border-l-red-500",
        purple: "border-l-4 border-l-purple-500",
    }
    const textColors = {
        green: "text-green-600",
        yellow: "text-yellow-600",
        red: "text-red-600",
        purple: "text-purple-600",
    }

    return (
        <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${borders[color]}`}>
            <h3 className={`text-3xl font-bold mb-1 ${textColors[color]}`}>{value}</h3>
            <span className="text-gray-500 text-sm font-medium">{label}</span>
        </div>
    )
}

function TableRow({ request }) {
    const { providerId, bloodType, units, status, createdAt, processedDate } = request;
    const labName = providerId?.facilityName || providerId?.name || 'Unknown Lab';
    const location = providerId?.address?.city || 'Unknown Location';

    const reqDate = new Date(createdAt).toLocaleDateString();
    const reqTime = new Date(createdAt).toLocaleTimeString();
    const procDate = processedDate ? new Date(processedDate).toLocaleDateString() : null;
    const procTime = processedDate ? new Date(processedDate).toLocaleTimeString() : null;

    return (
        <tr className="hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
                        {labName.charAt(0)}
                    </div>
                    <div>
                        <div className="font-bold text-gray-900">{labName}</div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1">
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            {location}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-0.5 rounded textxs font-bold ${bloodType.includes('A') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {bloodType}
                </span>
            </td>
            <td className="px-6 py-4 font-medium text-gray-900">
                {units} <span className="text-gray-400 text-xs font-normal">units</span>
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border 
                    ${status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-100' :
                        status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                            'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                    {status === 'Accepted' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                        status === 'Rejected' ? <XCircle className="w-3.5 h-3.5" /> :
                            <Clock className="w-3.5 h-3.5" />}
                    {status}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="text-xs font-bold text-gray-700">{reqDate}</div>
                <div className="text-[10px] text-gray-400">{reqTime}</div>
            </td>
            <td className="px-6 py-4">
                {!processedDate ? (
                    <span className="text-xs text-gray-400 italic">Not processed</span>
                ) : (
                    <>
                        <div className="text-xs font-bold text-gray-700">{procDate}</div>
                        <div className="text-[10px] text-gray-400">{procTime}</div>
                    </>
                )}
            </td>
        </tr>
    )
}
