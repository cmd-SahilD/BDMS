import { Award, Droplet } from "lucide-react";

export default function CertificateTemplate({ name, date, role = "Blood Donor" }) {
    return (
        <div id="certificate-print" className="p-8 w-full max-w-4xl mx-auto aspect-[1.414/1] flex flex-col relative overflow-hidden" style={{ backgroundColor: '#ffffff', color: '#111827', border: '8px double #7f1d1d', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-bl-full z-0 opacity-10 transform translate-x-1/3 -translate-y-1/3" style={{ backgroundColor: '#dc2626' }}></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-tr-full z-0 opacity-50 transform -translate-x-1/4 translate-y-1/4" style={{ backgroundColor: '#fee2e2' }}></div>

            {/* Header Logos Section */}
            <div className="relative z-10 flex justify-between items-start mb-8">
                <div className="flex gap-4">
                    {/* Placeholder for logos */}
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#dbeafe', border: '2px solid #1e40af' }}>
                        <span className="text-xs font-bold text-center" style={{ color: '#1e3a8a' }}>Govt<br />Logo</span>
                    </div>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fee2e2', border: '2px solid #991b1b' }}>
                        <span className="text-xs font-bold text-center" style={{ color: '#7f1d1d' }}>Red<br />Cross</span>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#dc2626' }}>BloodConnect Initiative</h2>
                    <p className="text-[10px]" style={{ color: '#6b7280' }}>Official Donation Record</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">

                {/* Certificate Title */}
                <h1 className="font-serif text-5xl md:text-6xl mb-2 tracking-wide" style={{ fontFamily: 'Times New Roman, serif', color: '#111827' }}>
                    Certificate
                </h1>
                <span className="font-serif text-2xl md:text-3xl italic mb-8" style={{ fontFamily: 'Times New Roman, serif', color: '#6b7280' }}>
                    of Recognition
                </span>

                <p className="text-sm font-medium uppercase tracking-widest mb-4" style={{ color: '#ef4444' }}>is proudly presented to</p>

                {/* Name */}
                <div className="relative mb-6">
                    <h2 className="text-4xl md:text-5xl font-bold uppercase px-8 py-2 inline-block min-w-[300px]" style={{ color: '#111827', borderBottom: '2px solid #111827' }}>
                        {name || "Donor Name"}
                    </h2>
                    <Award className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-8 h-8" style={{ color: '#eab308' }} />
                </div>

                {/* Body Text */}
                <div className="max-w-2xl mx-auto space-y-2 mb-8">
                    <p className="text-base leading-relaxed font-serif italic" style={{ color: '#374151' }}>
                        In grateful appreciation for your noble act of voluntary blood donation.
                    </p>
                    <p className="text-lg font-bold" style={{ color: '#b91c1c' }}>
                        "{role}"
                    </p>
                    <p className="text-sm" style={{ color: '#4b5563' }}>
                        Your selfless contribution has helped save lives and brings hope to our community.
                    </p>
                </div>

                {/* Date and Validation */}
                <p className="text-sm font-medium" style={{ color: '#6b7280' }}>
                    Given this <span className="font-bold px-2" style={{ color: '#111827', borderBottom: '1px solid #9ca3af' }}>{date || new Date().toLocaleDateString()}</span>
                </p>
            </div>

            {/* Footer / Signatures */}
            <div className="relative z-10 grid grid-cols-3 gap-8 mt-12 pt-8" style={{ borderTop: '1px solid #e5e7eb' }}>
                <div className="text-center">
                    <p className="font-script text-xl mb-2 font-bold rotate-[-2deg]" style={{ color: '#1e3a8a' }}>Dr. Sarah Smith</p>
                    <div className="h-px w-2/3 mx-auto mb-2" style={{ backgroundColor: '#9ca3af' }}></div>
                    <p className="text-[10px] uppercase font-bold" style={{ color: '#6b7280' }}>Medical Director</p>
                </div>

                <div className="flex flex-col items-center justify-center -mt-4">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ffffff', border: '4px solid #dc2626', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                        <Droplet className="w-10 h-10" style={{ color: '#dc2626', fill: '#dc2626' }} />
                    </div>
                    <p className="text-xs font-bold mt-2 uppercase" style={{ color: '#b91c1c' }}>Donate Blood, Save Lives</p>
                </div>

                <div className="text-center">
                    <p className="font-script text-xl mb-2 font-bold rotate-[1deg]" style={{ color: '#1e3a8a' }}>James Wilson</p>
                    <div className="h-px w-2/3 mx-auto mb-2" style={{ backgroundColor: '#9ca3af' }}></div>
                    <p className="text-[10px] uppercase font-bold" style={{ color: '#6b7280' }}>Program Coordinator</p>
                </div>
            </div>

            {/* Bottom Color Strip */}
            <div className="absolute bottom-0 left-0 w-full h-4" style={{ background: 'linear-gradient(to right, #1e3a8a, #dc2626, #1e3a8a)' }}></div>
        </div>
    );
}
