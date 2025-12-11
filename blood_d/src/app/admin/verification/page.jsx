import { ShieldAlert, RefreshCw, CheckCircle2, Building2 } from "lucide-react";

export default function VerificationPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Facility Verification</h1>
                        <p className="text-gray-500 text-sm">Review and verify hospital and blood lab registration requests</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors bg-white">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Alert Banner */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4">
                <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-red-800">0 Facilities Pending Verification</h3>
                    <p className="text-red-600 text-sm mt-1">Facilities awaiting admin approval to access the system</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Requests */}
                <div className="lg:col-span-2">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-red-600" />
                        Pending Requests (0)
                    </h3>

                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto mb-1">
                            No pending facility requests
                        </p>
                        <p className="text-gray-400 text-xs">
                            All facilities have been processed and approved
                        </p>
                    </div>
                </div>

                {/* Details Sidebar (Empty state) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[450px] flex flex-col items-center justify-center text-center p-8 mt-10">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 text-gray-400">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-700 mb-2">Select a Facility</h4>
                        <p className="text-gray-500 text-sm">
                            Click on any facility from the list to review details and take action
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
