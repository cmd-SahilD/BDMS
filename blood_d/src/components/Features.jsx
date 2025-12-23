import { Users, ClipboardList, Calendar } from "lucide-react";

export default function Features() {
    const features = [
        {
            icon: Users,
            title: "Donor Management",
            desc: "Register and manage donors, track donation history, and ensure eligibility for future donations.",
        },
        {
            icon: ClipboardList,
            title: "Inventory Tracking",
            desc: "Monitor blood inventory levels, track expiration dates, and manage blood distribution efficiently.",
        },
        {
            icon: Calendar,
            title: "Appointment Scheduling",
            desc: "Schedule and manage donation appointments, send reminders, and optimize facility capacity.",
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-sm mb-6">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
