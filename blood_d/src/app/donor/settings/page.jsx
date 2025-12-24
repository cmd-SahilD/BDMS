"use client";
import { useState, useEffect } from "react";
import { Lock, Shield, Bell, Eye, EyeOff, Save, Smartphone, X } from "lucide-react";

export default function DonorSettings() {
    const [showPassword, setShowPassword] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            alert("Donor password updated successfully!");
            setLoading(false);
        }, 1000);
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const verify2FA = () => {
        setLoading(true);
        setTimeout(() => {
            setIs2FAEnabled(true);
            setShow2FAModal(false);
            setLoading(false);
            alert("Two-Factor Authentication enabled!");
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Security & Privacy</h1>
                <p className="text-gray-500 mt-1">Manage your donor account security and preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-2">
                    <SidebarItem icon={Shield} label="Security" active />
                    <SidebarItem icon={Bell} label="Notifications" />
                </div>

                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-red-600" />
                                2-Way Authentication
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Protect your account with an extra layer of security</p>
                        </div>

                        <div className="p-8">
                            <div className="flex items-center justify-between p-6 rounded-2xl bg-red-50/50 border border-red-100">
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900">Authenticator App</p>
                                    <p className="text-xs text-gray-500">Use apps like Google Authenticator or Authy</p>
                                </div>
                                <button 
                                    onClick={() => is2FAEnabled ? setIs2FAEnabled(false) : setShow2FAModal(true)}
                                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${is2FAEnabled ? 'bg-white text-red-600 border border-red-200 hover:bg-red-50' : 'bg-red-600 text-white shadow-lg shadow-red-100'}`}
                                >
                                    {is2FAEnabled ? 'Disable' : 'Enable Setup'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                            <Lock className="w-5 h-5 text-red-600" />
                            Update Password
                        </h2>
                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                            <PasswordField label="Current Account Password" placeholder="••••••••" />
                            <PasswordField label="New Strong Password" placeholder="••••••••" show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? 'Saving...' : 'Save Password Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* 2FA Modal */}
            {show2FAModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl">
                        <div className="text-center space-y-4 mb-8">
                            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mx-auto">
                                <Smartphone className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Activate 2FA</h3>
                            <p className="text-xs text-gray-400">Scan the code and enter the 6-digit confirmation</p>
                        </div>

                        <div className="flex flex-col items-center gap-4 mb-8">
                            <div className="w-28 h-28 bg-gray-50 border border-gray-100 rounded-xl p-2">
                                <div className="grid grid-cols-4 gap-1 opacity-10">
                                    {[...Array(16)].map((_, i) => <div key={i} className="w-5 h-5 bg-black rounded-sm"></div>)}
                                </div>
                            </div>
                            <code className="text-[10px] font-mono bg-gray-50 px-3 py-1 rounded text-gray-400">ABCD-WXYZ-1234</code>
                        </div>

                        <div className="flex justify-between gap-2 mb-8">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength="1"
                                    value={data}
                                    onChange={e => handleOtpChange(index, e.target.value)}
                                    className="w-10 h-12 bg-gray-50 border border-gray-100 rounded-lg text-center font-bold focus:bg-white focus:border-red-500 outline-none"
                                />
                            ))}
                        </div>

                        <button
                            onClick={verify2FA}
                            disabled={otp.some(v => !v)}
                            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg"
                        >
                            Verify & Activate
                        </button>
                        <button onClick={() => setShow2FAModal(false)} className="w-full mt-4 text-xs font-bold text-gray-400">Cancel Setup</button>
                    </div>
                </div>
            )}
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
