'use client';

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Edit2 } from "lucide-react";

export default function ProfilePage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) setUser(storedUser);
    }, []);

    if (!user) {
        return <div className="text-center p-8">Loading profile...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 capitalize">{user.name}</h1>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <span className="font-bold text-red-600">{user.bloodType}</span>
                            <span>•</span>
                            <span className="font-mono">ID: {user._id}</span>
                        </div>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100">
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Status Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <User className="w-4 h-4 text-red-500" />
                            Donor Status
                        </h3>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                <span className="text-gray-500">Status</span>
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md font-bold text-xs">Active</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                <span className="text-gray-500">Blood Group</span>
                                <span className="font-bold text-red-600">{user.bloodType}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                <span className="text-gray-500">Donor ID</span>
                                <span className="font-mono text-xs text-gray-400">{user._id}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Last Donation</span>
                                <span className="font-medium text-gray-900">-</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <User className="w-4 h-4 text-red-500" />
                            Quick Info
                        </h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {user.email}
                            </div>
                            {user.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {user.phone}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <User className="w-4 h-4 text-red-500" />
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <InputGroup label="Full Name" value={user.name} />
                            <InputGroup label="Phone Number" value={user.phone || ''} />
                            {/* <InputGroup label="Age" value="21" /> */}
                            {/* Age/Weight not in User model yet, keeping clean or commented out */}
                            <SelectGroup label="Blood Group" value={user.bloodType} />
                        </div>

                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-500" />
                            Address Information
                        </h3>

                        <div className="space-y-6 mb-8">
                            {/* Address is stored as string in registration or object? Registration sends string/object mismatch potential.
                                Let's assume it's an object or string and try to render.
                                Register page sent: address: { street: ... }
                            */}
                            <InputGroup label="Address" value={user.address?.street || JSON.stringify(user.address) || ''} />
                        </div>

                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-red-500" />
                            Email Address
                        </h3>
                        <div className="mb-2">
                            <InputGroup value={user.email} disabled />
                        </div>
                        <p className="text-xs text-gray-400">Email cannot be changed</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputGroup({ label, value, disabled }) {
    return (
        <div>
            {label && <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>}
            <input
                type="text"
                defaultValue={value}
                disabled={disabled}
                className={`w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm font-medium
                    ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-gray-50 focus:bg-white text-gray-900'}`}
            />
        </div>
    )
}

function SelectGroup({ label, placeholder, value }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
            <div className="relative">
                <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm font-medium bg-gray-50 focus:bg-white text-gray-900 appearance-none"
                    defaultValue={value}
                >
                    <option disabled>{placeholder || "Select"}</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                </select>
                <div className="absolute right-4 top-3.5 pointer-events-none text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
            </div>
        </div>
    )
}
