'use client';

import { useState, useEffect } from 'react';
import { Droplets, Send } from "lucide-react";
import axios from 'axios';

export default function RequestsPage() {
    const [labs, setLabs] = useState([]);
    const [formData, setFormData] = useState({
        providerId: '',
        bloodType: '',
        units: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch Labs
        const fetchLabs = async () => {
            try {
                const response = await axios.get('/api/users?role=lab');
                setLabs(response.data);
            } catch (error) {
                console.error("Error fetching labs:", error);
            }
        };

        // Get current user from local storage (mock auth) or context
        // Ideally checking session, but for now assuming user info is stored on login
        // If not found, logic might come later. For now, we need requesterId.
        // Let's try to get it from localStorage if we put it there during login, 
        // OR we might need to rely on a session strategy.
        // user object is returned on login. Let's assume it's in localStorage for this implementation phase?
        // Or better yet, we can modify login to store it. 
        // For now, I'll add a check. If no user, we can't request.
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) setUser(storedUser);

        fetchLabs();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!user) {
            setMessage('Error: You must be logged in to make a request.');
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/requests', {
                requesterId: user._id,
                ...formData
            });
            setMessage('Request sent successfully!');
            setFormData({ providerId: '', bloodType: '', units: '', notes: '' });
        } catch (error) {
            console.error("Error sending request:", error);
            setMessage('Failed to send request. please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mb-4">
                    <Droplets className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Request Blood</h1>
                <p className="text-gray-500 text-sm mt-2">Request blood units from approved blood labs</p>
            </div>

            <div className="max-w-xl mx-auto">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {message && (
                            <div className={`p-3 rounded-lg text-sm text-center ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message}
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-bold text-red-600 mb-1.5 flex items-center gap-2">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><circle cx="12" cy="10" r="3" /></svg>
                                Select Blood Lab
                            </label>
                            <select
                                name="providerId"
                                value={formData.providerId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm bg-white"
                            >
                                <option value="">-- Select Blood Lab --</option>
                                {labs.map(lab => (
                                    <option key={lab._id} value={lab._id}>{lab.facilityName || lab.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-red-600 mb-1.5 flex items-center gap-2">
                                <Droplets className="w-3.5 h-3.5" />
                                Blood Type
                            </label>
                            <select
                                name="bloodType"
                                value={formData.bloodType}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm bg-white"
                            >
                                <option value="">-- Select Blood Type --</option>
                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Units Needed</label>
                            <input
                                name="units"
                                value={formData.units}
                                onChange={handleChange}
                                type="number"
                                min="1"
                                max="100"
                                required
                                placeholder="Enter number of units"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
                            />
                            <p className="text-xs text-gray-400 mt-1">Minimum 1 unit, maximum 100 units</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-colors flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <Send className="w-4 h-4" />
                            {loading ? 'Sending...' : 'Send Blood Request'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-xl mx-auto mt-12">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><circle cx="12" cy="10" r="3" /></svg>
                    Available Blood Labs ({labs.length})
                </h3>

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    {labs.length > 0 ? (
                        labs.map(lab => (
                            <LabItem
                                key={lab._id}
                                name={lab.facilityName || lab.name}
                                address={`${lab.address?.street || ''} ${lab.address?.city || ''}`}
                                phone={lab.phone}
                                hours="09:00 - 18:00"
                            />
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">No labs found</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function LabItem({ name, address, phone, hours }) {
    return (
        <div className="p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-gray-900 text-sm">{name}</h4>
                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    {hours}
                </span>
            </div>
            <div className="flex justify-between items-end">
                <p className="text-xs text-gray-500 w-3/4">{address}</p>
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    {phone}
                </span>
            </div>
        </div>
    )
}
