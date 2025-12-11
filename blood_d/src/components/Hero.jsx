import Link from "next/link";
import { Heart, ChevronRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-red-50 to-white">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
                <div className="absolute top-20 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
            </div>

            <div className="container relative mx-auto px-4 md:px-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-medium mb-6 animate-fade-in-up">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    Saving Lives Saves Lives
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
                    Connect <span className="text-red-600">Blood Donors</span> with <br className="hidden md:block" />
                    Those in <span className="text-red-600">Need</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Be the lifeline for someone in need. Join our community of donors and help save lives simply by donating blood to those who need it most.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/register"
                        className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-red-600 rounded-full overflow-hidden transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-200 hover:-translate-y-0.5"
                    >
                        <span className="mr-2">Get Started</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href="/about"
                        className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all hover:-translate-y-0.5"
                    >
                        <span className="mr-2">Learn More</span>
                        <Heart className="w-4 h-4 text-red-500" />
                    </Link>
                </div>
            </div>

            {/* Curved divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-16 fill-white">
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
                </svg>
            </div>
        </section>
    );
}
