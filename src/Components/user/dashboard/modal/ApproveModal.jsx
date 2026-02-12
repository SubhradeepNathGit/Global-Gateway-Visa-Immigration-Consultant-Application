import { CheckCircle, Clock, Send } from "lucide-react";

const ApprovalTimeline = ({ visa }) => {

    const timelineSteps = [
        {
            label: 'Application Submitted',
            date: visa?.applied_at,
            icon: Send,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100/70',
            completed: true
        },
        {
            label: 'Processing',
            date: visa?.applied_at,
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100/70',
            completed: true
        },
        {
            label: 'Approved',
            date: visa?.approval_date,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-100/70',
            completed: true
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-green-50/70 backdrop-blur-sm border border-green-200/50 rounded-xl transition-all duration-300 hover:shadow-lg">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold text-green-900">Application Approved</h3>
                    <p className="text-sm text-green-700">Application #{visa?.id}</p>
                </div>
            </div>

            <div className="relative">
                {timelineSteps.map((step, index) => {
                    const Icon = step?.icon;
                    return (
                        <div
                            key={index}
                            className="relative pb-8 last:pb-0 animate-[slideIn_0.4s_ease-out] opacity-0"
                            style={{
                                animation: `slideIn 0.4s ease-out forwards ${index * 0.15}s`
                            }}
                        >
                            {index < timelineSteps.length - 1 && (
                                <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-white/40 backdrop-blur-sm" />
                            )}
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${step.bgColor} backdrop-blur-sm flex items-center justify-center border border-white/30 transition-all duration-300 hover:scale-110`}>
                                    <Icon className={`w-5 h-5 ${step?.color}`} />
                                </div>
                                <div className="flex-1 pt-1">
                                    <h4 className="font-medium text-slate-900">{step.label}</h4>
                                    <p className="text-sm text-slate-600 mt-1">
                                        {step?.date ? new Date(step?.date)?.toLocaleDateString("en-GB", {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        }) : 'Date unavailable'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            }`}</style>
        </div>
    );
};

export default ApprovalTimeline;