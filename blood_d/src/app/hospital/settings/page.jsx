"use client";
import { useState } from "react";
import { Lock, Shield, Bell, Eye, EyeOff, Save, Smartphone, X } from "lucide-react";

export default function HospitalSettings() {
    const [showPassword, setShowPassword] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            alert("Hospital account password updated!");
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
            alert("Hospital 2-Way Authentication is now active!");
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Portal Settings</h1>
                <p className="text-gray-500 mt-1">Manage hospital security and notification preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-2">
                    <SidebarItem icon={Shield} label="Security" active />
                    <SidebarItem icon={Bell} label="Notifications" />
                </div>

                <div className="md:col-span-2 space-y-8">
                    {/* 2FA Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-red-600" />
                                2-Way Authentication
                            </h2>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${is2FAEnabled ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                {is2FAEnabled ? 'Protected' : 'Inactive'}
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-6 rounded-2xl bg-gray-50 border border-gray-100">
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Security Upgrade</p>
                                <p className="text-xs text-gray-400 mt-0.5">Activate 2FA for all staff logins</p>
                            </div>
                            <button 
                                onClick={() => is2FAEnabled ? setIs2FAEnabled(false) : setShow2FAModal(true)}
                                className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${is2FAEnabled ? 'bg-white text-red-600 border border-red-200 hover:bg-red-50' : 'bg-red-600 text-white shadow-lg shadow-red-100'}`}
                            >
                                {is2FAEnabled ? 'Disable' : 'Enable 2FA'}
                            </button>
                        </div>
                    </div>

                    {/* Password Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                            <Lock className="w-5 h-5 text-red-600" />
                            Security Credentials
                        </h2>
                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                            <PasswordField label="Staff Access Password" placeholder="••••••••" />
                            <PasswordField label="New Strong Password" placeholder="••••••••" show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Update Hospital Security
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
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mx-auto">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Confirm 2FA</h3>
                            <p className="text-xs text-gray-400">Security verification required for hospitals</p>
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
                            className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl shadow-xl shadow-red-100"
                        >
                            Verify & Activate
                        </button>
                        <button onClick={() => setShow2FAModal(false)} className="w-full mt-4 text-xs font-bold text-gray-400">Cancel</button>
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
