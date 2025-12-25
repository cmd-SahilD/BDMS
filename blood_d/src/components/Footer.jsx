import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                                B
                            </div>
                            <span className="text-xl font-bold text-white">
                                LifeSaver
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed mb-6 text-gray-400">
                            Connecting compassionate donors with those in need. Saving lives through advanced management technology.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="hover:text-red-500 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-red-500 transition-colors">Find Blood</Link></li>
                            <li><Link href="#" className="hover:text-red-500 transition-colors">Register as Donor</Link></li>
                            <li><Link href="#" className="hover:text-red-500 transition-colors">Success Stories</Link></li>
                            <li><Link href="#" className="hover:text-red-500 transition-colors">Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Resources</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="hover:text-red-500 transition-colors">Donation Process</Link></li>
                            <li><Link href="#" className="hover:text-red-500 transition-colors">Eligibility Criteria</Link></li>
                            <li><Link href="#" className="hover:text-red-500 transition-colors">Blood Types</Link></li>
                            <li><Link href="#" className="hover:text-red-500 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-red-500 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-6">For Hospitals</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-red-600 shrink-0" />
                                <span>Emergency Hotline: <br /><span className="text-white font-medium">1800-BLOOD-HELP</span></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-red-600 shrink-0" />
                                <span>hospitals@bloodconnect.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-red-600 shrink-0" />
                                <span>Kathmandu, Nepal</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} LifeSaver. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white">Privacy</Link>
                        <Link href="#" className="hover:text-white">Terms</Link>
                        <Link href="#" className="hover:text-white">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
