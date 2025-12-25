"use client";
import { useState, useEffect } from "react";
import { Lock, Shield, Eye, EyeOff, Save, AlertCircle, Smartphone, CheckCircle2 } from "lucide-react";

export default function AdminSettings() {
    const [showPassword, setShowPassword] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            alert("Admin password updated successfully!");
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
            alert("Two-Factor Authentication enabled successfully!");
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                <p className="text-gray-500 mt-1">Manage administrative security and system preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-2">
                    <SidebarItem icon={Shield} label="Security" active />
                </div>

                <div className="md:col-span-2 space-y-8">
                    {/* Security Section */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-red-600" />
                                Security Standards
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Configure your administrative access controls</p>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* 2FA Status */}
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${is2FAEnabled ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        <Smartphone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">Two-Factor Authentication</p>
                                        <p className="text-xs text-gray-500">{is2FAEnabled ? 'Protected' : 'Unprotected'}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => is2FAEnabled ? setIs2FAEnabled(false) : setShow2FAModal(true)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${is2FAEnabled ? 'bg-white text-red-600 border border-red-100 hover:bg-red-50' : 'bg-red-600 text-white shadow-lg shadow-red-100'}`}
                                >
                                    {is2FAEnabled ? 'Disable' : 'Enable 2FA'}
                                </button>
                            </div>

                            <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                <div className="space-y-4">
                                    <PasswordField label="Admin Current Password" placeholder="••••••••" />
                                    <PasswordField label="New Secure Password" placeholder="••••••••" show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                                    <PasswordField label="Confirm New Password" placeholder="••••••••" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                                >
                                    Update Credentials
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2FA Setup Modal */}
            {show2FAModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="text-center space-y-4 mb-8">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mx-auto">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Setup 2-Way Auth</h3>
                            <p className="text-sm text-gray-500">Scan the QR code with your authenticator app</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center gap-4 mb-8">
                            <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-inner flex items-center justify-center">
                                {/* Mock QR Code */}
                                <div className="grid grid-cols-4 gap-1 opacity-20">
                                    {[...Array(16)].map((_, i) => <div key={i} className="w-6 h-6 bg-black rounded-sm"></div>)}
                                </div>
                            </div>
                            <div className="text-center font-mono text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100">
                                ABCD-1234-EFGH-5678
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center block">Enter 6-Digit Code</label>
                            <div className="flex justify-between gap-2">
                                {otp.map((data, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={data}
                                        onChange={e => handleOtpChange(index, e.target.value)}
                                        className="w-12 h-14 bg-gray-50 border border-gray-100 rounded-xl text-center text-xl font-bold focus:bg-white focus:border-red-500 transition-all outline-none"
                                    />
                                ))}
                            </div>
                            <button
                                onClick={verify2FA}
                                disabled={loading || otp.some(v => !v)}
                                className={`w-full py-4 mt-4 bg-red-600 text-white font-bold rounded-2xl shadow-xl shadow-red-100 flex items-center justify-center gap-2 ${loading ? 'opacity-70' : ''}`}
                            >
                                {loading ? 'Verifying...' : 'Finish Setup'}
                            </button>
                            <button onClick={() => setShow2FAModal(false)} className="w-full text-xs font-bold text-gray-400 hover:text-gray-600">Cancel</button>
                        </div>
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
                    <button
                        type="button"
                        onClick={onToggle}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 px-1"
                    >
                        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>
        </div>
    );
}
