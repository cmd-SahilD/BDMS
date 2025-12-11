import { Search, PenLine, Heart, MessageCircle } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            number: 1,
            icon: Search,
            title: "Register as Donor",
            desc: "Complete our quick registration process and become a part of our saving community."
        },
        {
            number: 2,
            icon: PenLine,
            title: "Find a Need",
            desc: "Get notified when someone near you needs your blood type."
        },
        {
            number: 3,
            icon: Heart,
            title: "Visit the Clinic",
            desc: "Schedule an appointment and visit the nearest donation center."
        },
        {
            number: 4,
            icon: MessageCircle,
            title: "Saving Lives Forever",
            desc: "Your contributed blood will help save a life in emergency situations."
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Simple steps to become a hero. Just a few minutes of your time can save a life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-red-100 via-red-200 to-red-100 -z-0 border-t border-dashed border-red-300"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="relative bg-white pt-8 px-4 flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-full bg-white border-2 border-red-100 flex items-center justify-center mb-6 relative z-10 shadow-sm group-hover:bg-red-50 group-hover:border-red-200 transition-all">
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                                    {step.number}
                                </span>
                                <step.icon className="w-7 h-7 text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
