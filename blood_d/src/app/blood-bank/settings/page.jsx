"use client";
import { useState } from "react";
import { Lock, Shield, Eye, EyeOff, Save } from "lucide-react";

export default function BankSettings() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            alert("Blood Bank security credentials updated!");
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Facility Security</h1>
                <p className="text-gray-500 mt-1">Manage your blood bank's access security</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-2">
                    <SidebarItem icon={Shield} label="Security" active />
                </div>

                <div className="md:col-span-2 space-y-8">
                    {/* Password Section */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                            <Lock className="w-5 h-5 text-red-600" />
                            Security Credentials
                        </h2>
                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                            <PasswordField label="Current Password" placeholder="••••••••" />
                            <PasswordField label="New Password" placeholder="••••••••" show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? 'Saving...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SidebarItem({ icon: Icon, label, active }) {
    return (
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all
            ${active ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'text-gray-500 hover:bg-white hover:text-gray-900'}`}>
            <Icon className="w-5 h-5" />
            {label}
        </button>
    );
}

function PasswordField({ label, placeholder, show, onToggle }) {
    return (
        <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">{label}</label>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium text-sm text-gray-900"
                />
                {onToggle && (
                    <button type="button" onClick={onToggle} className="absolute right-4 top-4 text-gray-400 px-1">
                        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>
        </div>
    );
}
