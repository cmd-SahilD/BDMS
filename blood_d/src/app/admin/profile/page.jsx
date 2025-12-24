"use client";
import { useState, useEffect } from "react";
import { User, Mail, Shield, ShieldCheck, MapPin } from "lucide-react";
import axios from "axios";

export default function AdminProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("/api/users/profile");
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching admin profile:", error);
                const storedUser = localStorage.getItem("user");
                if (storedUser) setUser(JSON.parse(storedUser));
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading && !user) return <div className="p-12 text-center text-gray-500 font-medium animate-pulse">Loading admin profile...</div>;
    if (!user) return <div className="p-12 text-center text-gray-500 font-medium">Access Denied.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-[100px] -mr-8 -mt-8 opacity-50"></div>
                
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-32 h-32 rounded-3xl bg-red-600 text-white flex items-center justify-center text-5xl font-bold shadow-xl shadow-red-100 uppercase">
                        {user.name?.charAt(0)}
                    </div>
                    
                    <div className="text-center md:text-left space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-green-200">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Super Admin
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium">{user.email}</p>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-gray-400 font-mono mt-4">
                            <span>System ID: {user._id}</span>
                            <span>•</span>
                            <span className="capitalize">Role: {user.role}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                    <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Access Control
                    </h3>
                    <div className="space-y-4">
                        <PermissionItem label="User Management" enabled />
                        <PermissionItem label="Facility Verification" enabled />
                        <PermissionItem label="Inventory Oversight" enabled />
                        <PermissionItem label="System Configuration" enabled />
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                    <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Contact Info
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Registered Email</p>
                                <p className="text-sm font-bold text-gray-900">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PermissionItem({ label, enabled }) {
    return (
        <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
        </div>
    );
}
