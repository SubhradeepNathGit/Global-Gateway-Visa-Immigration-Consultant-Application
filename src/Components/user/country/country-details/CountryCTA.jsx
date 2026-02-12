import { ClipboardList, FileText } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { encodeBase64Url } from '../../../../util/encodeDecode/base64'

const CountryCTA = ({countryId,handleContinue}) => {
    return (
        <>
            <div className="mb-8 lg:mb-12 text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-light text-gray-900 mb-3">Ready to begin your journey?</h3>
                <p className="text-gray-600 font-light text-base lg:text-lg">Apply for your visa or explore our coaching services to ensure a smooth transition.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to={`/visaprocess/${encodeBase64Url(String(countryId))}`}
                    className="flex-1 px-6 sm:px-8 py-4 sm:py-5 bg-red-500 text-white font-medium rounded hover:bg-red-600 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 flex items-center justify-center gap-3 group"
                >
                    <FileText className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                    <span className="text-sm tracking-wide uppercase">Apply for Visa</span>
                </Link>

                <Link to='/course/'
                    className="flex-1 px-6 sm:px-8 py-4 sm:py-5 bg-white border-2 border-gray-200 text-gray-700 font-medium rounded hover:border-gray-300 hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-100 flex items-center justify-center gap-3 cursor-pointer"
                >
                    <ClipboardList className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                    <span className="text-sm tracking-wide uppercase">Check Visa Courses</span>
                </Link>
            </div>
        </>
    )
}

export default CountryCTA