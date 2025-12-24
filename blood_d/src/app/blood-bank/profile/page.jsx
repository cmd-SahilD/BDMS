"use client";
import { useState, useEffect } from "react";
import { User, Mail, ShieldCheck, Building2, Phone, MapPin, Edit3, Save } from "lucide-react";
import axios from "axios";

export default function BloodBankProfile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        facilityName: "",
        licenseNumber: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("/api/users/profile");
                const userData = response.data;
                setUser(userData);
                setFormData({
                    facilityName: userData.facilityName || "",
                    licenseNumber: userData.licenseNumber || "",
                    contactPerson: userData.name || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    address: typeof userData.address === 'string' ? userData.address : 
                             userData.address ? `${userData.address.street || ''} ${userData.address.city || ''}` : ""
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        setTimeout(() => {
            setIsEditing(false);
            setLoading(false);
            alert("Blood Bank profile updated successfully!");
        }, 800);
    };

    if (loading && !user) return <div className="p-12 text-center text-gray-500 font-medium animate-pulse">Loading blood bank profile...</div>;
    if (!user) return <div className="p-12 text-center text-gray-500 font-medium">Please login to view profile.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-[100px] -mr-8 -mt-8 opacity-50"></div>
                
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-32 h-32 rounded-3xl bg-red-600 text-white flex items-center justify-center text-5xl font-bold shadow-xl shadow-red-100 uppercase">
                        {formData.facilityName?.charAt(0) || formData.contactPerson?.charAt(0) || 'B'}
                    </div>
                    
                    <div className="text-center md:text-left space-y-2 flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">{formData.facilityName || "Blood Bank Facility"}</h1>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-green-200">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Verified Facility
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium">{formData.email}</p>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-gray-400 font-mono mt-4">
                            <span>License: {formData.licenseNumber || "N/A"}</span>
                            <span>•</span>
                            <span className="capitalize">Role: {user.role}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        disabled={loading}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${isEditing ? 'bg-black text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                    >
                        {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        {isEditing ? (loading ? 'Saving...' : 'Save Profile') : 'Edit Profile'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Facility Details */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                    <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Blood Bank Information
                    </h3>
                    
                    <div className="space-y-4">
                        <ProfileInput label="Blood Bank Name" value={formData.facilityName} isEditing={isEditing} onChange={(v) => setFormData({...formData, facilityName: v})} />
                        <ProfileInput label="Contact Person" value={formData.contactPerson} isEditing={isEditing} onChange={(v) => setFormData({...formData, contactPerson: v})} />
                        <ProfileInput label="License Number" value={formData.licenseNumber} isEditing={isEditing} onChange={(v) => setFormData({...formData, licenseNumber: v})} />
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                    <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Communication
                    </h3>
                    
                    <div className="space-y-4">
                        <ProfileInput label="Contact Email" value={formData.email} isEditing={false} />
                        <ProfileInput label="Phone Number" value={formData.phone} isEditing={isEditing} onChange={(v) => setFormData({...formData, phone: v})} />
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Address</label>
                            {isEditing ? (
                                <textarea 
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-medium focus:bg-white focus:border-red-500 outline-none transition-all"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    rows={2}
                                />
                            ) : (
                                <div className="p-3 bg-gray-50/50 rounded-xl text-sm font-bold text-gray-900 border border-transparent">
                                    {formData.address || "No address provided"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileInput({ label, value, isEditing, onChange }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            {isEditing ? (
                <input 
                    type="text"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:border-red-500 outline-none transition-all"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <div className="px-4 py-2.5 bg-gray-50/50 rounded-xl text-sm font-bold text-gray-900 border border-transparent">
                    {value || "N/A"}
                </div>
            )}
        </div>
    );
}
