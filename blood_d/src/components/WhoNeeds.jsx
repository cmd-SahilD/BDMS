import { Ambulance, Heart, Stethoscope, UserPlus } from "lucide-react";

export default function WhoNeeds() {
    const categories = [
        { icon: Ambulance, title: "Accident Victims", desc: "Critical care" },
        { icon: Heart, title: "Cancer Patients", desc: "Regular need" },
        { icon: Stethoscope, title: "Surgery Patients", desc: "During operation" },
        { icon: UserPlus, title: "Anemia Patients", desc: "Regular support" },
    ];

    return (
        <section className="py-20 bg-red-700 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Needs Your Blood?</h2>
                    <p className="text-red-100 max-w-2xl mx-auto">
                        Your single donation helps many patients with different needs.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-all text-center">
                            <div className="w-12 h-12 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                                <cat.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">{cat.title}</h3>
                            <p className="text-xs text-red-100 uppercase tracking-widest">{cat.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-white/10 rounded-2xl p-8 text-center max-w-3xl mx-auto border border-white/20">
                    <p className="text-lg md:text-xl font-medium">
                        "A single population is eligible to donate blood, but only 4% actually do. Your drop can make all the difference."
                    </p>
                </div>
            </div>
        </section>
    );
}
