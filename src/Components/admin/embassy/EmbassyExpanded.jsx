import React from 'react'
import { Building2, FileText } from 'lucide-react';
import AdditionalInfo from './row-expanded/AdditionalInfo';
import ContactInfo from './row-expanded/ContactInfo';
import NewCountrySection from './row-expanded/NewCountrySection';
import GeneralInfo from './row-expanded/GeneralInfo';

const EmbassyExpanded = ({ embassy }) => {

    return (
        <tr className="bg-slate-700/20 border-b border-slate-600/50">
            {(!embassy?.starting_hours || !embassy?.country_id) ? (
                <td colSpan="12" className="px-6 py-6">
                    <div className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-4 border border-slate-600/50 flex flex-col justify-center items-center h-50">
                        {/* <span className='text-center'> */}
                        <FileText className='mx-auto h-10 w-10' />
                        <p className='pt-2'>Application under processing</p>
                    </div>
                </td>
            ) : (
                <td colSpan="12" className="px-6 py-6">
                    <div className="ml-8">
                        <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Embassy Details
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {/* General Information */}
                            <GeneralInfo embassy={embassy} />

                            {/* Contact & Working Hours */}
                            <ContactInfo embassy={embassy} />
                            
                            {/* Additional Information */}
                            <AdditionalInfo embassy={embassy} />
                        </div>

                        {/* Country Setup Data - Only for New Countries */}
                        {!embassy?.is_country_listed && (
                            <NewCountrySection embassy={embassy} />
                        )}
                    </div>
                </td>
            )}
        </tr>
    )
}

export default EmbassyExpanded