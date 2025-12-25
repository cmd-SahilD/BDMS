"use client";
import CertificateTemplate from "@/components/donor/CertificateTemplate";
import { Printer, Download, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CertificatePage() {
    // In a real app, these would come from the database/session
    // Since this is inside DonorLayout, we could pass user down or fetch it here.
    // For now, we'll use static/mock data as placeholders until fully integrated with DB.
    const mockData = {
        name: "Suraj Duwal",
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
        role: "Voluntary Blood Donor"
    };

    const certificateRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = async () => {
        if (!certificateRef.current) return;

        setIsGenerating(true);
        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2, // Higher resolution
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 1000 // Force width to ensure layout matches desktop
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            // Calculate dimensions to fit A4 landscape (297mm x 210mm)
            const imgWidth = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Center vertically if it's shorter than the page
            const yPos = (210 - imgHeight) / 2;

            pdf.addImage(imgData, 'PNG', 0, yPos > 0 ? yPos : 0, imgWidth, imgHeight);
            pdf.save(`LifeSaver_Certificate_${mockData.name.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error("PDF Generation failed", error);
            alert("Failed to generate PDF. Please try printing instead.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Certificate</h1>
                    <p className="text-gray-500 text-sm">Download or print your certificate of recognition</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        <Printer className="w-4 h-4" />
                        Print
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-sm shadow-red-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        {isGenerating ? "Generating..." : "Download PDF"}
                    </button>
                </div>
            </div>

            <div className="flex justify-center print:block print:w-full print:absolute print:top-0 print:left-0 print:m-0">
                <div ref={certificateRef} className="print:transform-none transform scale-100 md:scale-95 origin-top transition-transform bg-white">
                    <CertificateTemplate
                        name={mockData.name}
                        date={mockData.date}
                        role={mockData.role}
                    />
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #certificate-print, #certificate-print * {
                        visibility: visible;
                    }
                    #certificate-print {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 0;
                        box-shadow: none;
                        border: none;
                    }
                    /* Hide Sidebar and Header in Layout */
                    aside, header {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
