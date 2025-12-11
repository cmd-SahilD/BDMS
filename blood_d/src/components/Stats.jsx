import { Heart, Users, MapPin, Clock } from "lucide-react";

const stats = [
    { icon: Heart, label: "Lives Saved", value: "10,000+", color: "text-red-600", bg: "bg-red-100" },
    { icon: Users, label: "Blood Donors", value: "50,000+", color: "text-red-600", bg: "bg-red-100" },
    { icon: MapPin, label: "Donation Centers", value: "150+", color: "text-red-600", bg: "bg-red-100" },
    { icon: Clock, label: "Response Time", value: "< 30min", color: "text-red-600", bg: "bg-red-100" },
];

export default function Stats() {
    return (
        <section className="py-10 bg-white -mt-10 relative z-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-red-50/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow border border-red-50">
                            <div className={`p-3 rounded-full ${stat.bg} mb-4`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
