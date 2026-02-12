import React from 'react'

const TopCountries = ({countryData}) => {

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Top Countries</h2>
            <p className="text-sm text-gray-600 mb-6">Applications by nationality</p>
            <div className="space-y-4">
                {countryData?.slice(0, 6)?.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-bold text-gray-900">{item?.countryName}</span>
                            <span className="text-gray-600 font-semibold">{item?.applications}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-600 to-cyan-500 h-6 rounded-full transition-all duration-1000"
                                style={{ width: `${(item?.applications / countryData[0].applications) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TopCountries