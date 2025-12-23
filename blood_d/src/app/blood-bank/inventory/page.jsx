"use client";

import { useState, useEffect } from "react";
import { Droplets, Plus, Loader2 } from "lucide-react";
import axios from "axios";

export default function InventoryPage() {
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        bloodType: "",
        units: 0,
        action: "Add Stock"
    });
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            fetchInventory(parsedUser._id);
        }
    }, []);

    const fetchInventory = async (facilityId) => {
        try {
            const response = await axios.get(`/api/inventory?facilityId=${facilityId}`);
            setInventory(response.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddStock = async () => {
        if (!user || !formData.bloodType || formData.units <= 0) return;

        try {
            await axios.post("/api/inventory", {
                facilityId: user._id,
                bloodType: formData.bloodType,
                units: parseInt(formData.units),
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days expiry
                status: "Adequate"
            });
            // Refresh inventory
            fetchInventory(user._id);
            // Reset form
            setFormData({ ...formData, units: 0, bloodType: "" });
        } catch (error) {
            console.error("Error adding stock:", error);
            alert("Failed to add stock");
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg text-red-600">
                        <Droplets className="w-6 h-6" />
                    </div>
                    Blood Stock Management
                </h1>
                <p className="text-gray-500 text-sm mt-1 ml-14">Manage your blood inventory and track stock levels</p>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={() => user && fetchInventory(user._id)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold bg-white hover:bg-red-50 transition-colors"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16.24V21h5" /></svg>
                    Refresh Stock
                </button>
            </div>

            {/* Add Stock Form */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" x2="12" y1="18" y2="12" /><line x1="9" x2="15" y1="15" y2="15" /></svg>
                    Add Blood Stock
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Blood Type</label>
                        <select
                            value={formData.bloodType}
                            onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-500 text-sm bg-white"
                        >
                            <option value="">Select Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Quantity (Units)</label>
                        <input
                            type="number"
                            value={formData.units}
                            onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-500 text-sm"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Action</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-500 text-sm bg-white">
                            <option>Add Stock</option>
                            {/* Remove stock logic not yet on API, so keep UI simple */}
                        </select>
                    </div>
                    <button
                        onClick={handleAddStock}
                        className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                    >
                        <Plus className="w-4 h-4" />
                        Add Units
                    </button>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-red-500" />
                        Current Blood Inventory
                    </h3>
                    <span className="text-xs text-gray-500">
                        Total: {inventory.reduce((acc, item) => acc + item.units, 0)} units
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 font-medium">Blood Type</th>
                                <th className="px-4 py-3 font-medium">Quantity</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Expiry Date</th>
                                <th className="px-4 py-3 font-medium">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-red-500" />
                                    </td>
                                </tr>
                            ) : inventory.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500">
                                        No inventory found. Add some stock!
                                    </td>
                                </tr>
                            ) : (
                                inventory.map((item) => (
                                    <StockRow
                                        key={item._id}
                                        type={item.bloodType}
                                        qty={item.units}
                                        expiry={new Date(item.expiryDate).toLocaleDateString()}
                                        updated={new Date(item.updatedAt).toLocaleDateString()}
                                        status={item.status}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StockRow({ type, qty, expiry, updated, status }) {
    return (
        <tr className="hover:bg-gray-50">
            <td className="px-4 py-4 font-bold text-gray-900">{type}</td>
            <td className="px-4 py-4 font-bold text-gray-900">{qty} units</td>
            <td className="px-4 py-4">
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wide">
                    {status}
                </span>
            </td>
            <td className="px-4 py-4 text-gray-500">{expiry}</td>
            <td className="px-4 py-4 text-gray-500">{updated}</td>
        </tr>
    )
}
