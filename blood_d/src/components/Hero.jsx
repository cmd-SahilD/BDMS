import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-red-50/30">
            <div className="container relative mx-auto px-4 md:px-6 text-center">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 max-w-5xl mx-auto leading-tight">
                    Blood Donation Management{' '}
                    <span className="block mt-2">System</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                    Efficiently manage blood donations, donors, inventory, and appointments with our comprehensive system.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link
                        href="/login"
                        className="min-w-[160px] px-8 py-3.5 text-base font-bold text-white bg-red-600 rounded-md hover:bg-red-700 transition-all shadow-sm"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/register"
                        className="min-w-[160px] px-8 py-3.5 text-base font-bold text-white bg-red-600 rounded-md hover:bg-red-700 transition-all shadow-sm"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </section>
    );
}
