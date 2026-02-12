import React from 'react'
import VisaRow from './VisaRow';
import { Globe, Loader2 } from 'lucide-react';
import CountryVisaTable from './CountryVisaTable';
import VisaSummary from './VisaSummary';

const VisaTable = ({ expandedVisa, setExpandedVisa, filteredVisas, isVisaListloading, getVisaStatus }) => {
    return (
        <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-600/50">
                <tr>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm w-12"></th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Visa Type</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm hidden lg:table-cell">Avg. Processing</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm hidden xl:table-cell">Avg. Validity</th>
                    <th className="text-center px-6 py-3 text-slate-400 font-medium text-sm hidden lg:table-cell">Applications</th>
                    <th className="text-center px-6 py-3 text-slate-400 font-medium text-sm">Global Status</th>
                    <th className="text-left px-6 py-3 text-slate-400 font-medium text-sm">Access Countries</th>
                    <th className="text-center px-6 py-3 text-slate-400 font-medium text-sm">Actions</th>
                </tr>
            </thead>
            <tbody>
                {isVisaListloading && (
                    <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
                        </td>
                    </tr>
                )}
                {filteredVisas?.map(visa => {
                    const currentStatus = getVisaStatus(visa.id, visa.globalStatus);
                    return (
                        <React.Fragment key={visa.id}>
                            <VisaRow expandedVisa={expandedVisa} setExpandedVisa={setExpandedVisa} visa={visa} />

                            {/* Expanded Country-wise Details */}
                            {expandedVisa === visa.id && (
                                <tr className="bg-slate-800/30">
                                    <td colSpan="8" className="px-4 py-5">
                                        <div className="space-y-5">
                                            {/* Global Status Message */}
                                            {currentStatus === 'blocked' && (
                                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Lock className="w-5 h-5 text-red-400" />
                                                        <p className="text-red-400 font-semibold text-sm">
                                                            This visa is not available right at this moment
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Country-wise Status */}
                                            <div>
                                                <h4 className="text-slate-300 font-semibold mb-3 flex items-center gap-2 text-sm">
                                                    <Globe className="w-4 h-4" />
                                                    Country-wise Details
                                                </h4>
                                                <div className="bg-slate-700/30 rounded-lg border border-slate-600/50 overflow-hidden">
                                                    <div className="overflow-auto" style={{ maxHeight: '280px' }}>
                                                        <style>{`
                                                        .country-scroll-container::-webkit-scrollbar {
                                                        width: 6px;
                                                        height: 6px;
                                                        }
                                                        .country-scroll-container::-webkit-scrollbar-track {
                                                        background: rgba(51, 65, 85, 0.3);
                                                        }
                                                        .country-scroll-container::-webkit-scrollbar-thumb {
                                                        background: rgba(148, 163, 184, 0.4);
                                                        border-radius: 3px;
                                                        }
                                                        .country-scroll-container::-webkit-scrollbar-thumb:hover {
                                                        background: rgba(148, 163, 184, 0.6);
                                                        }
                                                    `}</style>
                                                        <CountryVisaTable visa={visa} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Summary Cards */}
                                            <VisaSummary visa={visa} />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    );
                })}
            </tbody>
        </table>
    )
}

export default VisaTable