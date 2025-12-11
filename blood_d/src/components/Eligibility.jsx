import { CheckCircle2 } from "lucide-react";

export default function Eligibility() {
    const benefits = [
        { title: "General Health Checkup", desc: "Get a mini-physical checkup before every donation." },
        { title: "Heart Health", desc: "Regular donation helps to maintain iron levels and heart health." },
        { title: "Calorie Burn", desc: "Donate blood and burn up to 650 calories per donation." },
        { title: "Joy of Saving Lives", desc: "Experience the unique joy that comes from saving a human life." },
        { title: "Free Refreshments", desc: "Enjoy juice and cookies after your donation." },
        { title: "Blood Analysis", desc: "Get notified about your blood group and hemoglobin levels." },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Donor Eligibility & Benefits</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        It's safe, simple and rewarding. Here are the benefits of being a donor.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((item, index) => (
                        <div key={index} className="flex items-start gap-4 p-5 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="mt-1">
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
