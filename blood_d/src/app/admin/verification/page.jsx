"use client";
import { ShieldAlert, RefreshCw, CheckCircle2, Building2, User, Check, X, Mail, Phone, MapPin, Droplets, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function VerificationPage() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchPending = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/pending');
            setPendingUsers(res.data);
            if (res.data.length > 0 && !selectedUser) {
                setSelectedUser(res.data[0]);
            } else if (res.data.length === 0) {
                setSelectedUser(null);
            }
        } catch (error) {
            console.error("Error fetching pending users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleVerify = async (id) => {
        setActionLoading(true);
        try {
            await axios.put('/api/admin/facilities', { id, isVerified: true });
            // Since PUT /api/admin/facilities handles any user by ID, it works for donors too
            setPendingUsers(prev => prev.filter(u => u._id !== id));
            if (selectedUser?._id === id) {
                const remaining = pendingUsers.filter(u => u._id !== id);
                setSelectedUser(remaining.length > 0 ? remaining[0] : null);
            }
        } catch (error) {
            alert("Verification failed: " + (error.response?.data?.error || error.message));
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Verification</h1>
                        <p className="text-gray-500 text-sm">Review and verify new donor and facility registration requests</p>
                    </div>
                </div>
                <button 
                    onClick={fetchPending}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors bg-white outline-none"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Alert Banner */}
            <div className={`bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4 transition-all ${pendingUsers.length === 0 ? 'opacity-50 grayscale' : ''}`}>
                <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-red-800">{pendingUsers.length} Pending Verifications</h3>
                    <p className="text-red-600 text-sm mt-1">Users awaiting admin approval to access certain system features</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Requests */}
                <div className="lg:col-span-2">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-red-600" />
                        Pending Requests ({pendingUsers.length})
                    </h3>

                    {loading ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                            <RefreshCw className="w-10 h-10 text-red-600 animate-spin mb-4" />
                            <p className="text-gray-500">Loading requests...</p>
                        </div>
                    ) : pendingUsers.length > 0 ? (
                        <div className="space-y-4">
                            {pendingUsers.map((u) => (
                                <div 
                                    key={u._id}
                                    onClick={() => setSelectedUser(u)}
                                    className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${selectedUser?._id === u._id ? 'border-red-500 shadow-sm bg-red-50/10' : 'border-gray-100 shadow-sm'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${u.role === 'donor' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                                {u.role === 'donor' ? <User className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{u.facilityName || u.name}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'donor' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        {u.role}
                                                    </span>
                                                    <span className="text-gray-400 text-xs flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(u.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleVerify(u._id); }}
                                                disabled={actionLoading}
                                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                title="Approve"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-1">
                                No pending registration requests
                            </p>
                            <p className="text-gray-400 text-xs">
                                All users have been processed and approved
                            </p>
                        </div>
                    )}
                </div>

                {/* Details Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        {selectedUser ? (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <h3 className="font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4">Verification Details</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${selectedUser.role === 'donor' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {(selectedUser.facilityName || selectedUser.name).charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg leading-tight">{selectedUser.facilityName || selectedUser.name}</h4>
                                            <p className="text-gray-500 text-sm capitalize">{selectedUser.role}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <DetailItem icon={Mail} label="Email Address" value={selectedUser.email} />
                                        <DetailItem icon={Phone} label="Phone Number" value={selectedUser.phone || 'N/A'} />
                                        <DetailItem icon={MapPin} label="Address" value={
                                            selectedUser.address 
                                            ? `${selectedUser.address.street}, ${selectedUser.address.city}`
                                            : 'N/A'
                                        } />
                                        
                                        {selectedUser.role === 'donor' && (
                                            <>
                                                <DetailItem icon={Droplets} label="Blood Type" value={selectedUser.bloodType || 'N/A'} />
                                                <DetailItem icon={User} label="Age / Weight" value={selectedUser.age ? `${selectedUser.age} yrs / ${selectedUser.weight} kg` : 'N/A'} />
                                            </>
                                        )}

                                        {(selectedUser.role === 'hospital' || selectedUser.role === 'lab') && (
                                            <DetailItem icon={ShieldAlert} label="License Number" value={selectedUser.licenseNumber || 'N/A'} />
                                        )}
                                    </div>

                                    <div className="pt-6 border-t border-gray-50 space-y-3">
                                        <button 
                                            onClick={() => handleVerify(selectedUser._id)}
                                            disabled={actionLoading}
                                            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <Check className="w-5 h-5" />
                                            {actionLoading ? 'Verifying...' : 'Approve Registration'}
                                        </button>
                                        <button 
                                            disabled={actionLoading}
                                            className="w-full py-3 bg-white text-gray-400 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 border border-gray-100"
                                        >
                                            <X className="w-5 h-5" />
                                            Reject Request
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[450px] flex flex-col items-center justify-center text-center p-8">
                                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 text-gray-400">
                                    <ShieldAlert className="w-8 h-8" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-700 mb-2">Select a Request</h4>
                                <p className="text-gray-500 text-sm">
                                    Click on any registration from the list to review details and take action
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ icon: Icon, label, value }) {
    return (
        <div className="flex gap-4">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400 shrink-0 h-fit">
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <span className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider">{label}</span>
                <span className="text-gray-900 text-sm font-medium">{value}</span>
            </div>
        </div>
    );
}
