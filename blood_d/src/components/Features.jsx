import { HeartPulse, Droplets, Users, Activity } from "lucide-react";

export default function Features() {
    const features = [
        {
            icon: HeartPulse,
            title: "Save Lives, Spread Smiles",
            desc: "A single pint can save three lives, a single gesture can create a million smiles.",
            color: "text-red-500",
            bg: "bg-red-50"
        },
        {
            icon: Droplets,
            title: "Health Benefits",
            desc: "Donating blood reduces iron levels, lowers cancer risk, and keeps your heart healthy.",
            color: "text-red-500",
            bg: "bg-red-50"
        },
        {
            icon: Users,
            title: "Community Impact",
            desc: "Your donation ensures availability for emergencies, surgeries, and critical treatments.",
            color: "text-red-500",
            bg: "bg-red-50"
        },
        {
            icon: Activity,
            title: "Free Health Checkup",
            desc: "Each donation comes with a free mini-medical checkup including BP, pulse, and hemoglobin.",
            color: "text-red-500",
            bg: "bg-red-50"
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Your Blood Donation Matters</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Every drop counts. Your simple act of kindness creates ripples of hope and healing in the community.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                            <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <feature.icon className={`w-7 h-7 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">{feature.desc}</p>
                            <button className="mt-6 text-red-600 font-semibold text-sm hover:text-red-700 inline-flex items-center">
                                Learn More
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
