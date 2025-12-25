"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post("/api/login", formData);
            const { user } = response.data;

            // Store user data
            localStorage.setItem("user", JSON.stringify(user));

            // Redirect based on role
            switch (user.role) {
                case "admin":
                    router.push("/admin");
                    break;
                case "hospital":
                    router.push("/hospital");
                    break;
                case "blood-bank":
                case "lab":
                    router.push("/blood-bank");
                    break;
                default:
                    router.push("/donor");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-100 py-4">
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold group-hover:bg-red-700 transition-colors">
                            L
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            LifeSaver
                        </span>
                    </Link>
                    <Link href="/" className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 md:p-10 border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to LifeSaver</h1>
                        <p className="text-gray-500 text-sm">
                            Access your donor, hospital, or blood bank dashboard
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 border border-red-100 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-gray-400"
                                />
                                <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-gray-400"
                                />
                                <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <Link href="#" className="text-sm font-medium text-red-600 hover:text-red-500">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-red-600 text-white font-bold py-3.5 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-bold text-red-600 hover:text-red-500">
                            Register
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="py-6 text-center text-xs text-gray-400">
                &copy; {new Date().getFullYear()} LifeSaver. All rights reserved.
            </footer>
        </div>
    );
}
