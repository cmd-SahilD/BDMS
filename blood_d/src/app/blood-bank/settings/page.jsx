"use client";
import { useState } from "react";
import { Lock, Shield, Eye, EyeOff, Save } from "lucide-react";
import axios from "axios";

export default function BankSettings() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: ""
    });
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setMessage({ type: "", text: "" });
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        if (!formData.currentPassword || !formData.newPassword) {
            setMessage({ type: "error", text: "Please fill in all fields" });
            setLoading(false);
            return;
        }

        if (formData.newPassword.length < 6) {
            setMessage({ type: "error", text: "New password must be at least 6 characters" });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("/api/users/change-password", formData);
            setMessage({ type: "success", text: response.data.message || "Password updated successfully!" });
            setFormData({ currentPassword: "", newPassword: "" });
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.error || "Failed to update password"
            });
        } finally {
            setLoading(false);
        }
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

                        {message.text && (
                            <div className={`mb-4 p-4 rounded-xl text-sm font-medium ${message.type === "success"
                                    ? "bg-green-50 text-green-700 border border-green-100"
                                    : "bg-red-50 text-red-700 border border-red-100"
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                            <PasswordField
                                label="Current Password"
                                placeholder="••••••••"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                            />
                            <PasswordField
                                label="New Password"
                                placeholder="••••••••"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                show={showPassword}
                                onToggle={() => setShowPassword(!showPassword)}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
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

function PasswordField({ label, placeholder, show, onToggle, name, value, onChange }) {
    return (
        <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">{label}</label>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
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
