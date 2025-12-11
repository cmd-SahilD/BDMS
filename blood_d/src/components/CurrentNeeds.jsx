export default function CurrentNeeds() {
    const needs = [
        { type: "A+", urgency: "High Need", color: "red" },
        { type: "A-", urgency: "Critical Need", color: "red" },
        { type: "B+", urgency: "Moderate Need", color: "green" },
        { type: "B-", urgency: "High Need", color: "orange" },
        { type: "O+", urgency: "High Need", color: "orange" },
        { type: "O-", urgency: "Critical Need", color: "red" },
        { type: "AB+", urgency: "Low Need", color: "green" },
        { type: "AB-", urgency: "Moderate Need", color: "green" },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Current Blood Needs</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Real-time blood updates from blood banks nearby. Your specific blood type might be in critical demand right now.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 sm:px-0">
                    {needs.map((item, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-2xl border flex flex-col items-center justify-center transition-all hover:shadow-md
                ${item.color === 'red' ? 'bg-red-50 border-red-100' :
                                    item.color === 'orange' ? 'bg-orange-50 border-orange-100' :
                                        'bg-green-50 border-green-100'}`}
                        >
                            <span className={`text-4xl font-black mb-2 
                 ${item.color === 'red' ? 'text-red-500' :
                                    item.color === 'orange' ? 'text-orange-500' :
                                        'text-green-500'}`}>
                                {item.type}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                ${item.color === 'red' ? 'bg-red-100 text-red-700' :
                                    item.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                                        'bg-green-100 text-green-700'}`}>
                                {item.urgency}
                            </span>
                            <span className="text-xs text-gray-500 mt-2">12 Centers</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
