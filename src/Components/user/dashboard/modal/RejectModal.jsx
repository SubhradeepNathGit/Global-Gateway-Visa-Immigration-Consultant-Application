import { XCircle } from "lucide-react";

const RejectionModal = ({ visa }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50/70 backdrop-blur-sm border border-red-200/50 rounded-xl transition-all duration-300 hover:shadow-lg">
                <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold text-red-900">Application Rejected</h3>
                    <p className="text-sm text-red-700">Application #{visa?.id}</p>
                </div>
            </div>

            <div className="space-y-2">
                <h4 className="font-medium text-slate-900">Embassy Message:</h4>
                <p className="text-slate-700 leading-relaxed bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                    {visa?.rejection_reason || "Your visa application has been rejected due to incomplete documentation. Please ensure all required documents are submitted and meet the embassy's standards before reapplying."}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/30">
                <div>
                    <p className="text-sm text-slate-600">Applied Date</p>
                    <p className="font-medium text-slate-900">
                        {visa?.applied_at ? new Date(visa?.applied_at)?.toLocaleDateString("en-GB") : 'N/A'}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-slate-600">Rejection Date</p>
                    <p className="font-medium text-slate-900">
                        {visa?.updated_at ? new Date(visa?.updated_at).toLocaleDateString("en-GB") : 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RejectionModal;