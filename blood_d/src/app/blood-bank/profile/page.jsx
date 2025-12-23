"use client";
import { useState, useEffect } from "react";
import { Building2, Mail, Phone, MapPin, Shield, Edit2, Key, Award, AlertCircle, Save, User } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFormData(parsedUser);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setUser(formData);
        localStorage.setItem("user", JSON.stringify(formData));
        setIsEditing(false);
        alert("Profile updated successfully!");
    };

    if (!user) {
        return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Facility Profile</h1>
                    <p className="text-gray-500 mt-1">Manage your blood bank's public information and settings</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/blood-bank/settings" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        <Key className="w-4 h-4" />
                        Security Settings
                    </Link>
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm shadow-green-200"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-200"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 font-bold text-3xl">
                                    {user.facilityName?.charAt(0) || 'B'}
                                </div>
                                <div className="flex-1">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="facilityName"
                                            value={formData.facilityName || formData.name || ''}
                                            onChange={handleChange}
                                            className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-red-500 w-full"
                                            placeholder="Facility Name"
                                        />
                                    ) : (
                                        <h2 className="text-2xl font-bold text-gray-900">{user.facilityName || user.name || 'Blood Bank Name'}</h2>
                                    )}
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                            <Shield className="w-3.5 h-3.5" />
                                            Verified Facility
                                        </span>
                                        <span className="text-sm text-gray-400">•</span>
                                        <span className="text-sm text-gray-500">ID: {user._id?.slice(-8).toUpperCase() || '####'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">About Us</label>
                            {isEditing ? (
                                <textarea
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Describe your facility, mission, and services..."
                                    className="block w-full text-sm border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                                />
                            ) : (
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {user.description || 'No description provided. Add a brief description of your facility, its mission, and the services you offer to donors and hospitals.'}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-red-500" />
                                    Facility Details
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">License Number</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="licenseNumber"
                                                value={formData.licenseNumber || ''}
                                                onChange={handleChange}
                                                className="block w-full text-sm border-b border-gray-300 py-1 focus:outline-none focus:border-red-500"
                                            />
                                        ) : (
                                            <p className="text-sm font-medium text-gray-900">{user.licenseNumber || 'LIC-2024-XXXX'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">Facility Type</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="facilityType"
                                                value={formData.facilityType || 'Blood Bank & Processing Center'}
                                                onChange={handleChange}
                                                className="block w-full text-sm border-b border-gray-300 py-1 focus:outline-none focus:border-red-500"
                                            />
                                        ) : (
                                            <p className="text-sm font-medium text-gray-900">{user.facilityType || 'Blood Bank & Processing Center'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">Operational Hours</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="operationalHours"
                                                value={formData.operationalHours || '24/7 Emergency Service'}
                                                onChange={handleChange}
                                                className="block w-full text-sm border-b border-gray-300 py-1 focus:outline-none focus:border-red-500"
                                            />
                                        ) : (
                                            <p className="text-sm font-medium text-gray-900">{user.operationalHours || '24/7 Emergency Service'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                    Location
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">Address</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="addressStreet"
                                                value={formData.address?.street || ''}
                                                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                                                className="block w-full text-sm border-b border-gray-300 py-1 focus:outline-none focus:border-red-500"
                                            />
                                        ) : (
                                            <p className="text-sm font-medium text-gray-900">{user.address?.street || '123 Medical Center Dr'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">City & State</label>
                                        {isEditing ? (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="City"
                                                    value={formData.address?.city || ''}
                                                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                                                    className="block w-full text-sm border-b border-gray-300 py-1 focus:outline-none focus:border-red-500"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="State"
                                                    value={formData.address?.state || ''}
                                                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                                                    className="block w-20 text-sm border-b border-gray-300 py-1 focus:outline-none focus:border-red-500"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-sm font-medium text-gray-900">{user.address?.city || 'Metropolis'}, {user.address?.state || 'NY'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">Zip Code</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.address?.zip || ''}
                                                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zip: e.target.value } })}
                                                className="block w-full text-sm border-b border-gray-300 py-1 focus:outline-none focus:border-red-500"
                                            />
                                        ) : (
                                            <p className="text-sm font-medium text-gray-900">{user.address?.zip || '10001'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Award className="w-4 h-4 text-red-500" />
                            Certifications & Compliance
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                                <div className="w-full">
                                    <p className="font-semibold text-gray-900 text-sm">NABH Accredited</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="cert_nabh"
                                            value={formData.cert_nabh || 'Valid through Dec 2025'}
                                            onChange={handleChange}
                                            placeholder="Validity Status"
                                            className="block w-full text-xs border-b border-gray-300 py-1 mt-1 focus:outline-none focus:border-red-500 bg-transparent"
                                        />
                                    ) : (
                                        <p className="text-xs text-gray-500 mt-1">{user.cert_nabh || 'Valid through Dec 2025'}</p>
                                    )}
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                                <div className="w-full">
                                    <p className="font-semibold text-gray-900 text-sm">SBTC Registered</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="cert_sbtc"
                                            value={formData.cert_sbtc || 'License Active'}
                                            onChange={handleChange}
                                            placeholder="License Status"
                                            className="block w-full text-xs border-b border-gray-300 py-1 mt-1 focus:outline-none focus:border-red-500 bg-transparent"
                                        />
                                    ) : (
                                        <p className="text-xs text-gray-500 mt-1">{user.cert_sbtc || 'License Active'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Contact & Status */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Contact Information</h3>
                        <div className="space-y-6">


                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Email Address</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email || ''}
                                            onChange={handleChange}
                                            className="block w-full text-sm border-b border-gray-300 py-1 focus:outline-none focus:border-red-500"
                                        />
                                    ) : (
                                        <p className="text-sm font-medium text-gray-900 break-all">{user.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Phone Number</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone || ''}
                                            onChange={handleChange}
                                            className="block w-full text-sm border-b border-gray-300 py-1 focus:outline-none focus:border-red-500"
                                        />
                                    ) : (
                                        <p className="text-sm font-medium text-gray-900">{user.phone || '+1 (555) 123-4567'}</p>
                                    )}
                                </div>
                            </div>


                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-gray-100">
                             <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                <div className="flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold text-blue-900">Need Support?</p>
                                        <p className="text-xs text-blue-700 mt-1">Contact admin for updates to critical facility information.</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
