import React from 'react'
import EmbassyRow from './EmbassyRow'

const EmbassyTable = ({ filteredEmbassies, expandedEmbassies, setExpandedEmbassies,setSelectedDocument }) => {
    // console.log(filteredEmbassies);
    
    return (
        <table className="w-full">
            <thead>
                <tr className="border-b border-slate-600/50">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400 w-8"></th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Embassy</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Verification</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Registered</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Access</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Actions</th>
                </tr>
            </thead>

            <tbody>
                {filteredEmbassies.map((embassy) => (
                    <EmbassyRow key={embassy.id} embassy={embassy} expandedEmbassies={expandedEmbassies} setExpandedEmbassies={setExpandedEmbassies} setSelectedDocument={setSelectedDocument} />
                ))}
            </tbody>
        </table>
    )
}

export default EmbassyTable